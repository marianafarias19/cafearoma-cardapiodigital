document.addEventListener("DOMContentLoaded", function () {
  feather.replace();

  //Abrir/Fechar Menu no Celular
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });

  //Filtro de categorias
  const categoryButtons = document.querySelectorAll(".category-btn");
  const menuItems = document.querySelectorAll(".menu-item");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");

      //Atualizar os botões
      categoryButtons.forEach((btn) => {
        btn.classList.remove("bg-amber-700", "text-white");
        btn.classList.add("bg-amber-100", "text-amber-900");
      });
      this.classList.remove("bg-amber-100", "text-amber-900");
      this.classList.add("bg-amber-700", "text-white");

      // Filtrar itens do menu
      menuItems.forEach((item) => {
        if (
          category === "all" ||
          item.getAttribute("data-category") === category
        ) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  //Funcionalidades do carrinho
  const cartButton = document.getElementById("cart-button");
  const cartModal = document.getElementById("cart-modal");
  const closeCartButton = document.getElementById("close-cart");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartBadge = document.getElementById("cart-badge");
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutSuccessModal = document.getElementById(
    "checkout-success-modal"
  );
  const closeSuccessButton = document.getElementById("close-success");

  let cart = [];

  //Adicionar itens ao carrinho
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));

      //Verificar se o item já está no carrinho

      //Verificar se o item já está no carrinho
      const existingItem = cart.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price,
          quantity: 1,
        });
      }

      updateCart();

      // Mostrar mensagem de sucesso
      const originalText = this.textContent;
      this.textContent = "Adicionado ✓";
      this.disabled = true;
      this.classList.add("bg-green-600");

      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
        this.classList.remove("bg-green-600");
      }, 1000);
    });
  });

  // Atualizar o carrinho
  function updateCart() {
    if (cart.length === 0) {
      emptyCartMessage.classList.remove("hidden");
      cartBadge.classList.add("hidden");
    } else {
      emptyCartMessage.classList.add("hidden");
      cartBadge.classList.remove("hidden");
      cartBadge.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }

    //Limpa os itens do carrinho antes de adicionar novos
    while (cartItems.children.length > 1) {
      cartItems.removeChild(cartItems.lastChild);
    }

    // Adicionar itens ao carrinho
    let total = 0;
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className =
        "flex justify-between items-center py-2 border-b cart-item";
      cartItem.innerHTML = `
                        <div>
                            <h4 class="font-medium">${item.name}</h4>
                            <p class="text-sm text-gray-500">R$ ${item.price.toFixed(
                              2
                            )} x ${item.quantity}</p>
                        </div>
                        <div class="flex items-center">
                            <span class="font-medium mr-2">R$ ${itemTotal.toFixed(
                              2
                            )}</span>
                            <button class="remove-item text-red-500 hover:text-red-700" data-id="${
                              item.id
                            }">
                                <i data-feather="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    `;
      cartItems.appendChild(cartItem);
    });

    // Atualizar o total do carrinho
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;

    // Atualizar badge do carrinho
    feather.replace();

    // Adicionar eventos de remoção aos botões
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        cart = cart.filter((item) => item.id !== id);
        updateCart();
      });
    });
  }

  //Alterar visibilidade do carrinho
  cartButton.addEventListener("click", function () {
    cartModal.classList.toggle("hidden");
  });

  closeCartButton.addEventListener("click", function () {
    cartModal.classList.add("hidden");
  });

  // Finalizar compra
  checkoutBtn.addEventListener("click", function () {
    if (cart.length > 0) {
      cartModal.classList.add("hidden");
      checkoutSuccessModal.classList.remove("hidden");
      cart = [];
      updateCart();
    }
  });

  closeSuccessButton.addEventListener("click", function () {
    checkoutSuccessModal.classList.add("hidden");
  });

  // Avaliações
  const addReviewBtn = document.getElementById("add-review-btn");
  const reviewModal = document.getElementById("review-modal");
  const closeReviewButton = document.getElementById("close-review");
  const ratingInputs = document.querySelectorAll(".rating-input");
  const submitReviewButton = document.getElementById("submit-review");

  let selectedRating = 0;

  // Abrir/Fechar Modal de Avaliação
  addReviewBtn.addEventListener("click", function () {
    reviewModal.classList.toggle("hidden");
  });

  closeReviewButton.addEventListener("click", function () {
    reviewModal.classList.add("hidden");
  });

  // Avaliação com estrelas
  ratingInputs.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const rating = parseInt(this.getAttribute("data-rating"));
      highlightStars(rating);
    });

    star.addEventListener("mouseout", function () {
      highlightStars(selectedRating);
    });

    star.addEventListener("click", function () {
      selectedRating = parseInt(this.getAttribute("data-rating"));
      highlightStars(selectedRating);
    });
  });

  function highlightStars(rating) {
    ratingInputs.forEach((star) => {
      const starRating = parseInt(star.getAttribute("data-rating"));
      if (starRating <= rating) {
        star.textContent = "★";
        star.classList.add("text-amber-400");
      } else {
        star.textContent = "☆";
        star.classList.remove("text-amber-400");
      }
    });
  }

  // Enviar Avaliação
  submitReviewButton.addEventListener("click", function () {
    const name = document.getElementById("review-name").value;
    const text = document.getElementById("review-text").value;

    if (selectedRating > 0 && name && text) {
      // Você pode enviar a avaliação para o servidor aqui
      // Exemplo:
      reviewModal.classList.add("hidden");

      // Limpar campos de avaliação
      document.getElementById("review-name").value = "";
      document.getElementById("review-text").value = "";
      selectedRating = 0;
      highlightStars(0);

      // Mostrar mensagem de sucesso
      alert("Obrigado pela sua avaliação!");
    } else {
      alert("Por favor, preencha todos os campos e selecione uma avaliação.");
    }
  });

  // Fechar modais ao clicar fora deles
  window.addEventListener("click", function (event) {
    if (event.target === cartModal) {
      cartModal.classList.add("hidden");
    }
    if (event.target === reviewModal) {
      reviewModal.classList.add("hidden");
    }
    if (event.target === checkoutSuccessModal) {
      checkoutSuccessModal.classList.add("hidden");
    }
  });
});
