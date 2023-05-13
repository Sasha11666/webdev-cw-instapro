import { getPosts, postData, getUserData } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { renderHeaderComponent } from "./components/header-component.js";
import { manageLikes } from "./components/manage-likes.js";
import { manageDelete } from "./components/delete-post.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];



export const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // TODO: реализовать получение постов юзера из API
      console.log("Открываю страницу пользователя: ", data.userId);
      let id = data.userId;
      return getUserData({id, token: getToken()})
      .then((newPosts) => {
          console.log(newPosts);
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(USER_POSTS_PAGE);
        });
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // TODO: реализовать добавление поста в API
        console.log("Добавляю пост...", { description, imageUrl });
        postData({description, imageUrl, token: getToken()})
        .then(() => {
          goToPage(POSTS_PAGE);
        })
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      token: getToken()
    });
    
   
  }

  if (page === USER_POSTS_PAGE) {
    // TODO: реализовать страницу фотографию пользвателя
    appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts"></ul>
    </div>`

    let userPosts = appEl.querySelector('.posts');
    
    userPosts.innerHTML = posts.map((post) => {
      console.log(post.isLiked);
      return `<li class="post">
      <div class="post-header" data-user-id=${post.user.id}>
          <img src=${post.user.imageUrl} class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src=${post.imageUrl}>
      </div>
      <div data-post-id=${post.id} data-liked=${post.isLiked} class="post-likes">
        <button data-post-id=${post.id}  data-liked=${post.isLiked} class="like-button">
          <img ${ post.isLiked ? 'src="./assets/images/like-active.svg"' : 'src="./assets/images/like-not-active.svg"'}>
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length}</strong>
        </p>
      </div>
      <div class="footer">
        <div class="text-block">
          <p class="post-text">
            <span style="color: gray" class="user-name">${post.user.name}: </span>
            ${post.description}
          </p>
          <p class="post-date">
            ${post.createdAt}
          </p>
        </div>
        <button data-post-id=${post.id} data-user-id=${post.user.id} class="delete-button">
          <div class="delete-img"> </ div>
        </button>
      </ div>
    </li>`
    })
    .join("");

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });


    manageLikes({
      token: getToken()
    });

    let address = 
    manageDelete({
      token: getToken(),
      address
    })

    return;
  }
};

goToPage(POSTS_PAGE);
