import { loginUser, registerUser } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAuthPageComponent({ appEl, setUser }) {
  let isLoginMode = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${
                  isLoginMode
                    ? "Вход в&nbsp;Instapro"
                    : "Регистрация в&nbsp;Instapro"
                }
                </h3>
              <div class="form-inputs">
    
                  ${
                    !isLoginMode
                      ? `
                      <div class="upload-image-container"></div>
                      <div class="under-image"></div>
                      <input type="text" id="name-input" class="input" placeholder="Имя" />
                      `
                      : ""
                  }
                  
                  <input type="text" id="login-input" class="input" placeholder="Логин" />
                  <input type="password" id="password-input" class="input" placeholder="Пароль" />
                  
                  <div class="form-error"></div>
                  
                  <button class="button" id="login-button">${
                    isLoginMode ? "Войти" : "Зарегистрироваться"
                  }</button>
              </div>
            
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? "Зарегистрироваться." : "Войти."}
                  </button>
                </p> 
               
              </div>
          </div>
      </div>    
`;

    appEl.innerHTML = appHtml;

    // Не вызываем перерендер, чтобы не сбрасывалась заполненная форма
    // Точечно обновляем кусочек дом дерева
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

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

    const inputEls = document.querySelectorAll('.input');
    for(const inputEl of inputEls) {
      inputEl.addEventListener('change', () => {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;
        
        if(!isLoginMode) {
          const name = document.getElementById("name-input").value;

          document.getElementById("login-input").classList.remove('error');
          document.getElementById("password-input").classList.remove('error');
          document.getElementById("name-input").classList.remove('error');

          if(!login) {
            document.getElementById("login-input").classList.add('error');
            return;
          }else if(!password) {
            document.getElementById("password-input").classList.add('error');
            return;
          } else if(!name) {
            document.getElementById("name-input").classList.add('error');
            return;
          }
        }
          document.getElementById("login-input").classList.remove('error');
          document.getElementById("password-input").classList.remove('error');
  
          if(!login) {
            document.getElementById("login-input").classList.add('error');
            return;
          }else if(!password) {
            document.getElementById("password-input").classList.add('error');
            return;
          }
      })
    }
    

    document.getElementById("login-button").addEventListener("click", () => {
      setError("");

      const login = document.getElementById("login-input").value;
      const password = document.getElementById("password-input").value;

      if (isLoginMode) {
        document.getElementById("login-input").classList.remove('error');
        document.getElementById("password-input").classList.remove('error');
        if(!login) {
          document.getElementById("login-input").classList.add('error');
          return;
        }else if(!password) {
          document.getElementById("password-input").classList.add('error');
          return;
        }

        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      } else {
        const name = document.getElementById("name-input").value;
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;
        appEl.querySelector(".under-image").textContent = "";
     
        document.getElementById("login-input").classList.remove('error');
        document.getElementById("password-input").classList.remove('error');
        document.getElementById("name-input").classList.remove('error');
        document.querySelector('.upload-image-container').classList.remove('error');
        if(!login) {
          document.getElementById("login-input").classList.add('error');
          return;
        }else if(!password) {
          document.getElementById("password-input").classList.add('error');
          return;
        } else if(!name) {
          document.getElementById("name-input").classList.add('error');
          return;
        } else if(!imageUrl) {
          appEl.querySelector(".under-image").textContent = "Загрузите фотографию";
          return;
        }

        registerUser({
          login: login,
          password: password,
          name: name,
          imageUrl,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      }
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };

  renderForm();
}
