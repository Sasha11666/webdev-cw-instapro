import { deletePost } from "../api.js";
import { goToPage } from "../index.js";

export const manageDelete = ({token, address}) => {
  for(let deleteButton of document.querySelectorAll(".delete-button")) {
    deleteButton.addEventListener("click", () => {
      let postId = deleteButton.dataset.postId;
      deletePost({token, postId})
      .then(() => {
        manageDelete({token});
        goToPage(address);
      })
      .catch((err) => {
        console.log(err.message);
      })
    })
  }
}
      
      