import { addLike, deleteLike } from "../api.js";

export const manageLikes = ({token}) => {
  for(let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      let postId = likeButton.dataset.postId;
      let isLiked = likeButton.dataset.liked;
      console.log(isLiked);
      console.log(postId);
      console.log(token);

      if(isLiked == 'false') {
        addLike({postId, token})
        .then((data) => {
          console.log(data);
          console.log(document.querySelectorAll(".post-likes"));
          
          for(let likeBlock of document.querySelectorAll(".post-likes")) {
            if(likeBlock.dataset.postId === postId) {
              likeBlock.innerHTML = 
                `<div data-post-id=${data.post.id} data-liked=${data.post.isLiked} class="post-likes">
                   <button data-post-id=${data.post.id} data-liked=${data.post.isLiked}  class="like-button">
                     <img ${ data.post.isLiked ? 'src="./assets/images/like-active.svg"' : 'src="./assets/images/like-not-active.svg"'}>
                   </button>
                   <p class="post-likes-text">
                     Нравится: <strong>${data.post.likes.length}</strong>
                   </p>
                </div>`
              manageLikes({token});
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
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
                  <button data-post-id=${data.post.id} data-liked=${data.post.isLiked}  class="like-button">
                    <img ${ data.post.isLiked ? 'src="./assets/images/like-active.svg"' : 'src="./assets/images/like-not-active.svg"'}>
                  </button>
                  <p class="post-likes-text">
                    Нравится: <strong>${data.post.likes.length}</strong>
                  </p>
                </div>`
              manageLikes({token});
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        })
      }

    })
  }    
}