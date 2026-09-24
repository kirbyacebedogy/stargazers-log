const repositoryList = document.querySelector('#repository-list');
const repositoryCount = document.querySelector('#repository-count');

function formatStars(stars) {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(stars);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(`${date}T00:00:00`));
}

function renderRepositories(data) {
  const repositories = Array.isArray(data) ? data : data.repositories;

  if (!repositories || repositories.length === 0) {
    repositoryCount.textContent = '0 repos';
    repositoryList.innerHTML = '<p class="status-message">No repositories found.</p>';
    return;
  }

  repositoryCount.textContent = `${repositories.length} repos`;
  repositoryList.innerHTML = repositories.map((repository, index) => `
    <article class="repository-card" style="animation-delay: ${index * 80}ms">
      <div>
        <h3>
          <a href="${repository.url}" target="_blank" rel="noreferrer">
            ${repository.owner} / ${repository.name}
          </a>
        </h3>
        <p class="repository-description">${repository.description}</p>
        <div class="repository-meta">
          <span class="language">${repository.language}</span>
          <span>Starred ${formatDate(repository.starredOn)}</span>
        </div>
      </div>
      <div class="star-count" aria-label="${formatStars(repository.stars)} stars">* ${formatStars(repository.stars)}</div>
    </article>
  `).join('');
}

async function loadRepositories() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Could not load events.json: ${response.status}`);
    }
    renderRepositories(await response.json());
  } catch (error) {
    repositoryCount.textContent = 'Unavailable';
    repositoryList.innerHTML = '<p class="status-message">Repositories could not be loaded. Please try again later.</p>';
    console.error(error);
  }
}

loadRepositories();