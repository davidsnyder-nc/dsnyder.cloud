// --- Animation Logic ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// --- Header and Logo Animation ---
const logoText = document.getElementById('logo-text');
const logoImage = document.getElementById('logo-image');
const letters = logoText.querySelectorAll('.bounce-letter');
const lastLetter = letters[letters.length - 1];

function playBounceAnimation() {
  if (!logoText.classList.contains('is-animating')) {
    logoText.classList.add('is-animating');
  }
}

lastLetter.addEventListener('animationend', () => {
  logoText.classList.remove('is-animating');
});

logoText.addEventListener('mouseenter', playBounceAnimation);

window.addEventListener('load', () => {
  const header = document.querySelector('header');
  header.classList.remove('opacity-0', '-translate-y-full');

  setTimeout(() => {
    playBounceAnimation();
    logoImage.classList.add('logo-glow');
  }, 700);
});

logoImage.addEventListener('animationend', () => {
  logoImage.classList.remove('logo-glow');
});


// --- GitHub API Fetch & Repo Card Generation ---
const GITHUB_USERNAME = 'davidsnyder-nc';
const reposContainer = document.getElementById('repos-container');
const loadingIndicator = document.getElementById('loading-indicator');

function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day > 28) return date.toLocaleDateString();
  if (day >= 1) return `${day}d ago`;
  if (hr >= 1) return `${hr}h ago`;
  if (min >= 1) return `${min}m ago`;
  return 'just now';
}

const LANGUAGE_COLORS = {
  'JavaScript': 'bg-yellow-400',
  'TypeScript': 'bg-blue-400',
  'Python': 'bg-green-400',
  'Go': 'bg-cyan-400',
  'Rust': 'bg-orange-400',
  'Ruby': 'bg-red-400',
  'Java': 'bg-amber-500',
  'C#': 'bg-purple-400',
  'C++': 'bg-indigo-400',
  'HTML': 'bg-red-300',
  'CSS': 'bg-blue-300',
  'Shell': 'bg-emerald-400'
};

async function fetchRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`);
    if (!response.ok) {
      throw new Error(`GitHub API returned a ${response.status} status.`);
    }
    const repos = await response.json();

    loadingIndicator.style.display = 'none';

    let filteredRepos = repos.filter(repo => {
      const repoName = repo.name.toLowerCase();
      return repoName !== 'dsnyder.cloud' && 
             repoName !== 'davidsnyder-nc.github.io';
    });

    filteredRepos.sort((a, b) => a.name.localeCompare(b.name));

    if (filteredRepos.length === 0) {
      reposContainer.innerHTML += `<p class="col-span-full text-center text-gray-400">No other public repositories found.</p>`;
      return;
    }

    const specialRepoWebsites = {
      'gitvault': 'https://gitvault.app'
    };

    filteredRepos.forEach((repo, index) => {
      const repoCard = document.createElement('div');
      repoCard.className = 'group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-800/60 to-gray-900/60 ring-1 ring-white/10 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 animate-on-scroll';
      repoCard.style.transitionDelay = `${index * 100}ms`;

      const description = repo.description || 'No description available.';
      let websiteLinkHTML = '';
      const repoNameLower = repo.name.toLowerCase();

      if (specialRepoWebsites[repoNameLower]) {
        const url = specialRepoWebsites[repoNameLower];
        websiteLinkHTML = `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white">
            Website
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5H21m0 0v7.5m0-7.5L10.5 15M6 6h.008v.008H6V6z"/></svg>
          </a>`;
      }

      repoCard.innerHTML = `
        <div class="relative">
          <div class="absolute inset-0">
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-red-600/20 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl"></div>
          </div>
          <div class="relative p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-bold text-white">${repo.name}</h3>
                <p class="mt-1 text-sm text-gray-300">${description}</p>
              </div>
              <div class="flex items-center gap-2">
                ${repo.language ? `<span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"><span class="inline-block h-2 w-2 rounded-full ${LANGUAGE_COLORS[repo.language] || 'bg-gray-400'}"></span>${repo.language}</span>` : ''}
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-300">
              <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-red-400"><path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 4.29 2.862 7.902 6.75 9.167.494.091.675-.214.675-.476 0-.237-.009-.868-.013-1.703-2.747.597-3.326-1.324-3.326-1.324-.45-1.146-1.1-1.452-1.1-1.452-.9-.615.068-.603.068-.603 1.002.07 1.53 1.03 1.53 1.03.883 1.515 2.318 1.078 2.883.825.09-.638.345-1.078.627-1.326-2.193-.249-4.498-1.097-4.498-4.882 0-1.078.39-1.96 1.03-2.65-.103-.253-.447-1.273.097-2.652 0 0 .84-.269 2.75 1.014A9.56 9.56 0 0 1 12 6.84c.85.004 1.705.116 2.503.34 1.91-1.283 2.749-1.014 2.749-1.014.545 1.379.201 2.399.098 2.652.64.69 1.028 1.572 1.028 2.65 0 3.795-2.309 4.63-4.507 4.874.354.306.673.91.673 1.834 0 1.325-.012 2.39-.012 2.713 0 .264.18.57.681.472A9.757 9.757 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75Z"/></svg>
                ${repo.stargazers_count}
              </div>
              <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-red-400"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12m0 0l-5.25 5.25M22.5 12H3"/></svg>
                <span>Updated ${formatRelativeTime(repo.updated_at)}</span>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <button data-repo="${repo.name}" class="more-info-btn inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 transition-colors">
                More Info
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
              </button>
              ${websiteLinkHTML}
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300">
                GitHub
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>
        </div>
      `;
      reposContainer.appendChild(repoCard);

      repoCard.querySelector('.more-info-btn').addEventListener('click', (e) => {
        const repoName = e.currentTarget.getAttribute('data-repo');
        showReadmeModal(repoName);
      });

      observer.observe(repoCard);
    });

  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error);
    loadingIndicator.style.display = 'none';
    reposContainer.innerHTML = `<p class="col-span-full text-center text-red-400">Could not load projects. Please try again later.</p>`;
  }
}

// --- README Modal Logic ---
const readmeDialog = document.getElementById('readme-dialog');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeReadmeModalBtn = document.getElementById('close-readme-modal-btn');

async function showReadmeModal(repoName) {
  modalTitle.textContent = `${repoName} - README.md`;
  modalBody.innerHTML = `
    <div class="text-center p-8">
      <svg class="animate-spin h-8 w-8 text-red-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-gray-400">Loading README...</p>
    </div>`;

  readmeDialog.showModal();

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('README.md not found in this repository.');
      throw new Error('Could not fetch README due to a network or API error.');
    }

    const data = await response.json();

    if (!data.content) throw new Error('README file is empty or could not be read.');

    const binaryString = atob(data.content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const readmeContent = new TextDecoder('utf-8').decode(bytes);

    const rawHtml = marked.parse(readmeContent);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;

    const images = tempDiv.querySelectorAll('img');
    images.forEach((img, index) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http')) {
        const rawBaseUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/`;
        img.src = new URL(src, rawBaseUrl).href;
      }
      img.id = `readme-image-${repoName}-${index}`;
    });

    const thumbnailContainer = document.createElement('div');
    if (images.length > 0) {
      thumbnailContainer.className = 'flex flex-wrap gap-2 border-b border-gray-700 pb-4 mb-4';
      images.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img.src;
        thumb.className = 'w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity';
        thumb.title = 'Click to scroll to image';
        thumb.onclick = () => {
          const originalImage = document.getElementById(`readme-image-${repoName}-${index}`);
          if (originalImage) {
            originalImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        };
        thumbnailContainer.appendChild(thumb);
      });
    }

    modalBody.innerHTML = '';
    if (images.length > 0) {
      modalBody.appendChild(thumbnailContainer);
    }
    modalBody.appendChild(tempDiv);


  } catch (error) {
    console.error("Failed to fetch README:", error);
    modalBody.innerHTML = `<div class="text-center p-8"><p class="text-red-400">${error.message}</p></div>`;
  }
}

function closeReadmeModal() {
  const modalContent = readmeDialog.querySelector('.modal-content');
  modalContent.style.transform = 'translateY(100%)';
  modalContent.addEventListener('transitionend', () => {
    readmeDialog.close();
    modalContent.style.transform = ''; 
  }, { once: true });
}

closeReadmeModalBtn.addEventListener('click', closeReadmeModal);
readmeDialog.addEventListener('click', (event) => {
  if (event.target === readmeDialog) {
    closeReadmeModal();
  }
});

// --- Contact Modal Logic ---
const contactDialog = document.getElementById('contact-dialog');
const contactNavLink = document.getElementById('contact-nav-link');
const closeContactModalBtn = document.getElementById('close-contact-modal-btn');

contactNavLink.addEventListener('click', () => {
  contactDialog.showModal();
});

function closeContactModal() {
  const modalContent = contactDialog.querySelector('.modal-content');
  modalContent.style.transform = 'translateY(100%)';
  modalContent.addEventListener('transitionend', () => {
    contactDialog.close();
    modalContent.style.transform = ''; 
  }, { once: true });
}

closeContactModalBtn.addEventListener('click', closeContactModal);
contactDialog.addEventListener('click', (event) => {
  if (event.target === contactDialog) {
    closeContactModal();
  }
});


// --- Event Listener for Featured Project ---
const featuredButton = document.getElementById('featured-more-info');
if (featuredButton) {
  featuredButton.addEventListener('click', (e) => {
    const repoName = e.currentTarget.getAttribute('data-repo');
    showReadmeModal(repoName);
  });
}

// --- Contact Form Logic ---
const contactForm = document.getElementById('contact-form');
const formResult = document.getElementById('form-result');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const object = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  const json = JSON.stringify(object);
  formResult.innerHTML = "Sending...";
  formResult.classList.remove('text-green-400', 'text-red-400');

  fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let jsonResponse = await response.json();
      if (response.status == 200) {
        formResult.innerHTML = jsonResponse.message;
        formResult.classList.add('text-green-400');
      } else {
        console.log(response);
        formResult.innerHTML = jsonResponse.message;
        formResult.classList.add('text-red-400');
      }
    })
    .catch(error => {
      console.log(error);
      formResult.innerHTML = "Something went wrong!";
      formResult.classList.add('text-red-400');
    })
    .then(function() {
      contactForm.reset();
      setTimeout(() => {
        formResult.innerHTML = '';
      }, 5000);
    });
});


// Fetch repositories on page load
fetchRepos();
