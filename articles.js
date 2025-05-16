function saveArticle(title, content) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Для публикации статьи необходимо авторизоваться');
        return null;
    }

    const newArticle = {
        id: Date.now().toString(),
        title,
        content,
        author: {
            id: user.id,
            name: user.name,
            avatar: user.picture
        },
        createdAt: new Date().toISOString()
    };

    const articles = getAllArticles();
    articles.unshift(newArticle);
    localStorage.setItem('articles', JSON.stringify(articles));
    return newArticle;
}

function getAllArticles() {
    return JSON.parse(localStorage.getItem('articles')) || [];
}

function getArticleById(id) {
    const articles = getAllArticles();
    return articles.find(article => article.id === id);
}

function displayArticles(containerId = 'articles-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const articles = getAllArticles();

    if (articles.length === 0) {
        container.innerHTML = '<p class="no-articles">Пока нет статей</p>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <article class="article-card" data-id="${article.id}">
            <h3 class="article-title">${article.title}</h3>
            <div class="article-preview">${getArticlePreview(article.content)}</div>
            <div class="article-footer">
                <div class="article-meta">
                    <img src="${article.author.avatar || 'images/default-avatar.png'}" 
                         alt="${article.author.name}" 
                         class="author-avatar">
                    <span class="author-name">${article.author.name}</span>
                </div>
                <a href="article.html?id=${article.id}" class="btn read-more-btn">Читать полностью</a>
            </div>
        </article>
    `).join('');
}

function getArticlePreview(content, length = 150) {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
}

function initArticlesPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (articleId) {
        const article = getArticleById(articleId);
        if (article) {
            document.getElementById('article-title').textContent = article.title;
            document.getElementById('article-content').innerHTML = article.content;
            document.getElementById('author-avatar').src = article.author.avatar || 'images/default-avatar.png';
            document.getElementById('author-name').textContent = article.author.name;
        }
    } else if (document.getElementById('articles-list')) {
        displayArticles();
    }
}

document.addEventListener('DOMContentLoaded', initArticlesPage);