import { deletePost } from "../api.js";
import { goToPage } from "../index.js";

export const manageDelete = ({token, address}) => {
  for(let deleteButton of document.querySelectorAll(".delete-button")) {
    deleteButton.addEventListener("click", () => {
      let postId = deleteButton.dataset.postId;
      let userId = deleteButton.dataset.userId;
      deletePost({token, postId})
      .then(() => {
          goToPage(address, {
            userId,
          });
      })
      .catch((err) => {
        console.log(err.message);
      })
    })
  }
}
      
      