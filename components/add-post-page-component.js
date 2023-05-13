import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  let description = "";

  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      Cтраница добавления поста
      <div class="upload-image-container"></div>
      <div class="upload-description-container">
        <input type="text" class="post-description" />
      </div>
      <button class="button" id="add-button">Добавить</button>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    let element = appEl.querySelector(".upload-description-container");
    const DescriptionInputElement = element.querySelector(".post-description");
    
    DescriptionInputElement?.addEventListener("change", () => {
      if (DescriptionInputElement) {
          description = DescriptionInputElement.value;
      }
    });  

   
    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
         description: description,
         imageUrl: imageUrl,
       });
     });
    
     
  };

  render();
}
