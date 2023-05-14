import { deletePost } from "../api.js";
import { goToPage } from "../index.js";

export const manageDelete = ({token, address, user}) => {
  for(let deleteButton of document.querySelectorAll(".delete-button")) {
    deleteButton.addEventListener("click", () => {
      let postId = deleteButton.dataset.postId;
      let userId = deleteButton.dataset.userId;
      
      
      if(token && user._id === userId) {
        deletePost({token, postId})
        .then(() => {
            goToPage(address, {
              userId,
            });
        })
        .catch((err) => {
          console.log(err.message);
        })
      } else if(token && user._id !== userId){
        alert('Вы можете удалять только свои посты');
      } else {
        deletePost({token})
        .catch((err) => {
          console.log(err.message);
        })
      }
     
    })
  }
}
      
      