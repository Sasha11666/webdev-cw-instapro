import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { addLike, deleteLike } from "../api.js";


export function renderPostsPageComponent({ appEl, token }) {
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
  postsHTML = posts.map((post, index) => {
    return `<li class="post">
    <div class="post-header" data-user-id=${post.user.id}>
        <img src=${post.user.imageUrl} class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
    </div>
    <div class="post-image-container">
      <img class="post-image" src=${post.imageUrl}>
    </div>
    <div data-post-id=${post.id} data-liked=${post.isLiked} class="post-likes">
      <button data-post-id=${post.id} data-liked=${post.isLiked} data-index=${index} class="like-button">
        <img ${ post.isLiked ? 'src="./assets/images/like-active.svg"' : 'src="./assets/images/like-not-active.svg"'}>
      </button>
      <p class="post-likes-text">
        Нравится: <strong>${post.likes.length}</strong>
      </p>
    </div>
    <p class="post-text">
      <span style="color: gray" class="user-name">${post.user.name}: </span>
      ${post.description}
    </p>
    <p class="post-date">
      ${post.createdAt}
    </p>
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


  const manageLikes = () => {
    for(let likeButton of document.querySelectorAll(".like-button")) {
      likeButton.addEventListener("click", () => {
        let postId = likeButton.dataset.postId;
        let isLiked = likeButton.dataset.liked;
        let index = likeButton.dataset.index;
        console.log(isLiked);
        console.log(postId);
        console.log(token);
        console.log(index);
  
        if(isLiked == 'false') {
          addLike({postId, token})
          .then((data) => {
            console.log(data);
            console.log(document.querySelectorAll(".post-likes"));
            
            for(let likeBlock of document.querySelectorAll(".post-likes")) {
              if(likeBlock.dataset.postId === postId) {
                likeBlock.innerHTML = 
                  `<div data-post-id=${data.post.id} data-liked=${data.post.isLiked} class="post-likes">
                     <button data-post-id=${data.post.id} data-liked=${data.post.isLiked} data-index=${index} class="like-button">
                       <img ${ data.post.isLiked ? 'src="./assets/images/like-active.svg"' : 'src="./assets/images/like-not-active.svg"'}>
                     </button>
                     <p class="post-likes-text">
                       Нравится: <strong>${data.post.likes.length}</strong>
                     </p>
                  </div>`
                manageLikes();
              }
            }
          })
        } else if(isLiked == 'true') {
          deleteLike({postId, token})
          .then((data) => {
            console.log(data);
            console.log(document.querySelectorAll(".post-likes"));
  
            for(let likeBlock of document.querySelectorAll(".post-likes")) {
              if(likeBlock.dataset.postId === postId) {
                likeBlock.innerHTML = 
                  `<div data-post-id=${data.post.id} data-liked=${data.post.isLiked} class="post-likes">
                    <button data-post-id=${data.post.id} data-liked=${data.post.isLiked} data-index=${index} class="like-button">
                      <img ${ data.post.isLiked ? 'src="./assets/images/like-active.svg"' : 'src="./assets/images/like-not-active.svg"'}>
                    </button>
                    <p class="post-likes-text">
                      Нравится: <strong>${data.post.likes.length}</strong>
                    </p>
                  </div>`
                manageLikes();
              }
            }
          })
        }

      })
    }    
  }
  manageLikes();
}
