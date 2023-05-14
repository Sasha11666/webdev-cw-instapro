import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { manageDelete } from "./delete-post.js";
import { manageLikes } from "./manage-likes.js";


export function renderPostsPageComponent({ appEl, token, user }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  
  let appHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts"></ul>
    </div>`
  appEl.innerHTML = appHTML;
  console.log('Header');

  let postsEl = appEl.querySelector('.posts');

  let postsHTML;
  postsHTML = posts.map((post) => {
    return `<li class="post">
    <div class="post-header" data-user-id=${post.user.id}>
        <img src=${post.user.imageUrl} class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
    </div>
    <div class="post-image-container">
      
      <img class="post-image" src=${post.imageUrl}>
      
    </div>
    <div data-post-id=${post.id} data-liked=${post.isLiked} class="post-likes">
      <button data-post-id=${post.id} data-liked=${post.isLiked}  class="like-button">
        <img ${ post.isLiked ? 'src="./assets/images/like-active.svg"' : 'src="./assets/images/like-not-active.svg"'}>
      </button>
      <p class="post-likes-text">
        Нравится: <strong>${post.likes.length}</strong>
      </p>
    </div>
    <div class="footer">
      <div class="text-block">
        <p class="post-text">
          <span style="font-weight: 600" class="user-name">${post.user.name} </span>
          <span style="font-weight: 200">${post.description}</span>
        </p>
        <p class="post-date">
          ${post.createdAt}
        </p>
      </div>
      <button data-post-id=${post.id} data-user-id=${post.user.id} class="delete-button">
        <div class="delete-img"> </ div>
      </button>
    </div>
  </li>`
  })
  .join("");
  postsEl.innerHTML = postsHTML;

  console.log('posts rendered');

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  let address = POSTS_PAGE;
  manageDelete({token, address, user});
  manageLikes({token});

}


