const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';

//check it the user is logged in, if not back to the fuckin login page
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html';
}

// state
let allIssues = [];      
let currentFilter = 'all';  

// grabs the element
const loadingSpinner = document.getElementById('loadingSpinner');
const issuesGrid = document.getElementById('issuesGrid');
const emptyState = document.getElementById('emptyState');
const emptyStateText = document.getElementById('emptyStateText');
const issueCountHeading = document.getElementById('issueCountHeading');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const issueModal = document.getElementById('issueModal');
const modalContent = document.getElementById('modalContent');
const modalLoadingEl = document.getElementById('modalLoadingSpinner');

//fetch all isseus
function fetchAllIssues() {
    showLoading();

    fetch(API_BASE + '/issues')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            allIssues = data.data || [];
            renderIssues(filterIssues(allIssues, currentFilter));
            hideLoading();
        })
        .catch(function (error) {
            console.log('Error fetching issues:', error);
            showEmpty('Failed to load issues. Check your internet connection.');
            hideLoading();
        });
}

//filter issues based on the current filter
function filterIssues(issues, filter) {
    if (filter === 'all') {
        return issues; // return everything
    }
    // only return issues that match the filter
    return issues.filter(function (issue) {
        return issue.status === filter;
    });
}

//switch tabs
function switchTab(filter) 
{
    currentFilter = filter;

    // update which tab looks active (purple)
    const allTabBtns = document.querySelectorAll('.tab-btn');
    allTabBtns.forEach(function (btn) {
        if (btn.dataset.filter === filter) {
            btn.style.backgroundColor = '#7c3aed';
            btn.style.color = '#ffffff';
            btn.style.fontWeight = '600';
        } else {
            btn.style.backgroundColor = '';
            btn.style.color = '#a1a1aa';
            btn.style.fontWeight = '500';
        }
    });

    renderIssues(filterIssues(allIssues, filter));
}




//render the issue cards in the grid
function renderIssues(issues) {
    issuesGrid.innerHTML = ''; // clear old cards

    if (issues.length === 0) {
        showEmpty('No issues found.');
        return;
    }

    emptyState.classList.add('hidden');
    issuesGrid.classList.remove('hidden');
    issueCountHeading.textContent = issues.length + ' Issues';

    // Build a card for each issue
    issues.forEach(function (issue, index) {
        const card = buildCard(issue);
        issuesGrid.appendChild(card);
    });
}

// builds a single issue card element
function buildCard(issue) {
    const isOpen = issue.status === 'open';

    // Create the card div
    const card = document.createElement('div');
    card.className = 'bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col cursor-pointer hover:bg-zinc-800 transition-colors duration-200';

    // when clicked → open the modal
    card.addEventListener('click', function () {
        openModal(issue.id);
    });

    // top coloured stripe (green = open, purple = closed)
    const topBar = document.createElement('div');
    topBar.className = 'w-full';
    topBar.style.height = '3px';
    topBar.style.backgroundColor = isOpen ? '#10b981' : '#7c3aed';

    // inner content area
    const inner = document.createElement('div');
    inner.className = 'p-3.5 flex flex-col gap-2.5 flex-1';

    // status icon + priority badge
    const topRow = document.createElement('div');
    topRow.className = 'flex items-center justify-between';

    const statusIcon = document.createElement('img');
    statusIcon.className = 'w-5 h-5 object-contain';
    statusIcon.src = isOpen ? 'assets/Open-Status.png' : 'assets/Closed- Status .png';
    statusIcon.alt = issue.status;

    const priority = (issue.priority || 'low').toLowerCase();
    const priorityBadge = document.createElement('span');
    priorityBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ' + getPriorityClass(priority);
    priorityBadge.textContent = priority.toUpperCase();

    topRow.appendChild(statusIcon);
    topRow.appendChild(priorityBadge);

    // title
    const title = document.createElement('h3');
    title.className = 'text-[13px] font-bold text-white leading-snug line-clamp-2';
    title.textContent = issue.title;

    // description
    const desc = document.createElement('p');
    desc.className = 'text-xs text-zinc-500 leading-snug line-clamp-2';
    desc.textContent = issue.description;

    // label pills
    const labelsRow = document.createElement('div');
    labelsRow.className = 'flex flex-wrap gap-1';
    if (issue.labels && issue.labels.length > 0) {
        issue.labels.forEach(function (label) {
            const pill = document.createElement('span');
            pill.className = 'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ' + getLabelClass(label);
            pill.textContent = label.toUpperCase();
            labelsRow.appendChild(pill);
        });
    }

    // thin divider line
    const divider = document.createElement('div');
    divider.className = 'h-px bg-zinc-800';

    // footer with issue number, author and date
    const footer = document.createElement('div');
    footer.className = 'flex justify-between items-end gap-1 flex-wrap';

    const authorDiv = document.createElement('div');
    authorDiv.className = 'text-[11px] text-zinc-500';
    authorDiv.innerHTML = '#' + issue.id + ' by <span class="text-zinc-600">' + (issue.author || 'unknown') + '</span>';

    const dateDiv = document.createElement('div');
    dateDiv.className = 'text-[11px] text-zinc-600';
    dateDiv.textContent = formatDate(issue.createdAt);

    footer.appendChild(authorDiv);
    footer.appendChild(dateDiv);

    // assemble everything
    inner.appendChild(topRow);
    inner.appendChild(title);
    inner.appendChild(desc);
    inner.appendChild(labelsRow);
    inner.appendChild(divider);
    inner.appendChild(footer);

    card.appendChild(topBar);
    card.appendChild(inner);

    return card;
}

// openmodal — fetch single issue then show it
function openModal(id) {
    issueModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // stop page scroll
    modalContent.innerHTML = '';
    modalLoadingEl.classList.remove('hidden');

    // fetch one  issue by its id
    fetch(API_BASE + '/issue/' + id)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            modalLoadingEl.classList.add('hidden');
            renderModal(data.data);
        })
        .catch(function (error) {
            console.log('Error fetching issue:', error);
            modalLoadingEl.classList.add('hidden');
            modalContent.innerHTML = '<p class="text-red-400 p-5">Could not load issue details.</p>';
        });
}

// renders the modal content for a single issue
function renderModal(issue) {
    const isOpen = issue.status === 'open';
    const topBarColor = isOpen ? '#10b981' : '#7c3aed';

    // build labels html
    let labelsHtml = '';
    if (issue.labels && issue.labels.length > 0) {
        issue.labels.forEach(function (l) {
            labelsHtml += '<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ' + getLabelClass(l) + '">' + l.toUpperCase() + '</span>';
        });
    }

    // status tag colours
    const statusClass = isOpen
        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
        : 'bg-purple-950 text-purple-400 border border-purple-900';

    const priorityClass = getPriorityClass((issue.priority || 'low').toLowerCase());

    const assigneeHtml = issue.assignee
        ? issue.assignee
        : '<span class="text-zinc-500">Unassigned</span>';

    // build the HTML string
    let html = '';

    // top stripe
    html += '<div style="height:5px;background:' + topBarColor + ';border-radius:12px 12px 0 0;margin:-28px -28px 20px;"></div>';

    // Title
    html += '<h2 class="text-xl font-bold text-white mb-2.5 leading-snug">' + issue.title + '</h2>';

    // status badge + opened-by
    html += '<div class="flex items-center gap-2.5 flex-wrap mb-3.5">';
    html += '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ' + statusClass + '">' + (isOpen ? 'Opened' : 'Closed') + '</span>';
    html += '<span class="text-sm text-zinc-400">• ' + (isOpen ? 'Opened' : 'Closed') + ' by <strong class="text-zinc-200 font-semibold">' + (issue.author || 'Unknown') + '</strong> • ' + formatDate(issue.createdAt) + '</span>';
    html += '</div>';

    // labels
    if (labelsHtml) {
        html += '<div class="flex flex-wrap gap-1.5 mb-4">' + labelsHtml + '</div>';
    }

    // description
    html += '<p class="text-sm text-zinc-400 leading-relaxed mb-5 bg-zinc-950 border border-zinc-800 rounded-lg p-3.5">' + issue.description + '</p>';

    // assignee + priority box
    html += '<div class="flex border border-zinc-800 rounded-xl overflow-hidden mb-6">';
    html += '<div class="flex-1 p-4 bg-zinc-950"><div class="text-xs text-zinc-500 mb-1.5">Assignee:</div><div class="text-sm font-bold text-white">' + assigneeHtml + '</div></div>';
    html += '<div class="w-px bg-zinc-800"></div>';
    html += '<div class="flex-1 p-4 bg-zinc-950"><div class="text-xs text-zinc-500 mb-1.5">Priority:</div><div><span class="inline-block text-[11px] font-bold px-3 py-0.5 rounded-full uppercase ' + priorityClass + '">' + (issue.priority || 'N/A').toUpperCase() + '</span></div></div>';
    html += '</div>';

    // close button
    html += '<div class="flex justify-end">';
    html += '<button onclick="closeModal()" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-7 py-2.5 rounded-md text-sm transition-colors cursor-pointer">Close</button>';
    html += '</div>';

    modalContent.innerHTML = html;
}

//close modal function 
function closeModal() {
    issueModal.classList.add('hidden');
    document.body.style.overflow = '';
}

// click outside the modal box → close it
function closeModalOutside(e) {
    if (e.target === issueModal) {
        closeModal();
    }
}

// press esc → close modal
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

//search functionality
searchBtn.addEventListener('click', function () {
    doSearch(searchInput.value);
});

searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        doSearch(searchInput.value);
    }
});

function doSearch(query) {
    query = query.trim();

    if (!query) {
        // empty search → reload all issues
        fetchAllIssues();
        return;
    }

    showLoading();

    fetch(API_BASE + '/issues/search?q=' + encodeURIComponent(query))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            allIssues = data.data || [];
            renderIssues(filterIssues(allIssues, currentFilter));
            hideLoading();
        })
        .catch(function (error) {
            console.log('Search error:', error);
            showEmpty('Search failed. Try again.');
            hideLoading();
        });
}

// helper functions

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    issuesGrid.classList.add('hidden');
    emptyState.classList.add('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showEmpty(msg) {
    issuesGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    emptyStateText.textContent = msg;
    issueCountHeading.textContent = '0 Issues';
}

function formatDate(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
}

function getPriorityClass(priority) {
    if (priority === 'high') return 'bg-red-950 text-red-400';
    if (priority === 'medium') return 'bg-amber-950 text-amber-400';
    return 'bg-zinc-800 text-zinc-400';
}

function getLabelClass(label) {
    const l = label.toLowerCase();
    if (l.includes('bug')) return 'bg-red-950 text-red-400 border border-red-900';
    if (l.includes('enhancement')) return 'bg-emerald-950 text-emerald-400 border border-emerald-900';
    if (l.includes('help')) return 'bg-amber-950 text-amber-400 border border-amber-900';
    if (l.includes('doc')) return 'bg-blue-950 text-blue-400 border border-blue-900';
    return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
}

// initial load
fetchAllIssues();
