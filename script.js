/* ============================================================
   SUGAR CAFE — JAVASCRIPT
   Controls:
   - Menu categories
   - Menu item details popup
   - Shopping cart
   - Quantity controls
   - Add-to-cart notification
   - Customer details
   - Receipt generation
   - Copy receipt
   - Messenger button

   Simple, clean, no unnecessary wizardry.
   ============================================================ */

/* ============================================================
   MENU CATEGORY FILTER
   ============================================================ */

const categoryButtons = document.querySelectorAll(".category-button");
const menuCards = document.querySelectorAll(".menu-card");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.category;

    categoryButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    menuCards.forEach((card) => {
      if (card.dataset.category === selectedCategory) {
        card.classList.remove("hidden-category");
      } else {
        card.classList.add("hidden-category");
      }
    });
  });
});

/* ============================================================
   MENU ITEM DETAILS POPUP
   Clicking a menu card (or its image) opens a bigger view with
   the full picture and details, and lets the customer add the
   item straight to their order from there.

   The popup markup and styling both live in index.html /
   style.css — this just wires it up.
   ============================================================ */

const menuDetailOverlay = document.getElementById("menuDetailOverlay");

const menuDetailClose = document.getElementById("closeMenuDetailBtn");

const menuDetailImage = document.getElementById("menuDetailImage");

const menuDetailCategory = document.getElementById("menuDetailCategory");

const menuDetailTitle = document.getElementById("menuDetailTitle");

const menuDetailPrice = document.getElementById("menuDetailPrice");

const menuDetailDescription = document.getElementById("menuDetailDescription");

const menuDetailAddBtn = document.getElementById("menuDetailAddBtn");

let selectedMenuItem = null;

/* ============================================================
   OPEN MENU ITEM DETAILS
   ============================================================ */

function openMenuDetails(card) {
  if (!card) {
    return;
  }

  selectedMenuItem = card;

  /* ==========================================================
     GET THE REAL INFORMATION FROM THE CLICKED MENU CARD
     No hardcoded menu items. The card already knows everything.
     ========================================================== */

  const imageElement = card.querySelector(".menu-image img");
  const titleElement = card.querySelector(".menu-title-row h3");
  const priceElement = card.querySelector(".price");
  const descriptionElement = card.querySelector(".menu-card-content > p");

  const addButton = card.querySelector(".add-button");

  const image = imageElement?.getAttribute("src") || "";

  const imageAlt = imageElement?.getAttribute("alt") || "";

  const title = titleElement?.textContent.trim() || "Menu Item";

  const price = priceElement?.textContent.trim() || "₱0";

  const description =
    descriptionElement?.textContent.trim() ||
    "A delicious Sugar Cafe favorite.";

  const category = card.getAttribute("data-category") || "menu";

  /* ==========================================================
     PUT THE INFORMATION INTO THE POPUP
     ========================================================== */

  menuDetailImage.removeAttribute("src");

  if (image) {
    menuDetailImage.setAttribute("src", image);
  }

  menuDetailImage.setAttribute("alt", imageAlt || title);

  menuDetailTitle.textContent = title;

  menuDetailPrice.textContent = price;

  menuDetailDescription.textContent = description;

  menuDetailCategory.textContent = `${formatMenuCategory(category)} · MENU ITEM`;

  /* ==========================================================
     CONNECT THE POPUP BUTTON TO THE REAL MENU ITEM
     ========================================================== */

  menuDetailAddBtn.dataset.name = addButton?.dataset.name || title;

  menuDetailAddBtn.dataset.price =
    addButton?.dataset.price || price.replace(/[^\d.]/g, "");

  /* ==========================================================
     OPEN
     ========================================================== */

  menuDetailOverlay.classList.add("active");
}
/* ============================================================
   FORMAT CATEGORY NAME
   ============================================================ */

function formatMenuCategory(category) {
  if (!category) {
    return "MENU";
  }

  return category
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* ============================================================
   CLOSE MENU ITEM DETAILS
   ============================================================ */

function closeMenuDetails() {
  menuDetailOverlay.classList.remove("active");

  selectedMenuItem = null;
}

menuDetailClose.addEventListener("click", closeMenuDetails);

/* ============================================================
   CLICK OUTSIDE POPUP
   ============================================================ */

menuDetailOverlay.addEventListener("click", (event) => {
  if (event.target === menuDetailOverlay) {
    closeMenuDetails();
  }
});

/* ============================================================
   CLICK MENU CARDS
   ============================================================ */

menuCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    // If the customer clicked Add to Order,
    // don't open the details popup.
    if (event.target.closest(".add-button")) {
      return;
    }

    openMenuDetails(card);
  });

  // Explicit image click support.
  // This makes the image itself open the popup.

  const imageContainer = card.querySelector(".menu-image");

  if (imageContainer) {
    imageContainer.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openMenuDetails(card);
    });
  }
});

/* ============================================================
   CART DATA
   ============================================================ */

let cart = [];

/* ============================================================
   CART ELEMENTS
   ============================================================ */

const cartDrawer = document.getElementById("cartDrawer");

const cartOverlay = document.getElementById("cartOverlay");

const openCartBtn = document.getElementById("openCartBtn");

const closeCartBtn = document.getElementById("closeCartBtn");

const cartItemsContainer = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

const getReceiptBtn = document.getElementById("getReceiptBtn");

/* ============================================================
   CUSTOMER DETAILS
   ============================================================ */

const customerName = document.getElementById("customerName");

const customerNumber = document.getElementById("customerNumber");

const customerAddress = document.getElementById("customerAddress");

const customerError = document.getElementById("customerError");

const receiptCustomerName = document.getElementById("receiptCustomerName");

const receiptCustomerNumber = document.getElementById("receiptCustomerNumber");

const receiptCustomerAddress = document.getElementById(
  "receiptCustomerAddress",
);

/* ============================================================
   VALIDATE CUSTOMER DETAILS
   ============================================================ */

function validateCustomerDetails() {
  const name = customerName.value.trim();

  const number = customerNumber.value.trim();

  const address = customerAddress.value.trim();

  if (!name || !number || !address) {
    customerError.classList.add("show");

    return false;
  }

  customerError.classList.remove("show");

  return true;
}

/* ============================================================
   OPEN CART
   ============================================================ */

function openCart() {
  cartDrawer.classList.add("active");

  cartOverlay.classList.add("active");

  document.body.classList.add("no-scroll");
}

/* ============================================================
   CLOSE CART
   ============================================================ */

function closeCart() {
  cartDrawer.classList.remove("active");

  cartOverlay.classList.remove("active");

  document.body.classList.remove("no-scroll");
}

openCartBtn.addEventListener("click", openCart);

closeCartBtn.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

/* ============================================================
   ADD ITEM TO CART
   IMPORTANT:
   Clicking Add to Order does NOT open the cart.
   ============================================================ */

const addButtons = document.querySelectorAll(".add-button");

addButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    event.stopPropagation();

    const name = button.dataset.name;

    const price = Number(button.dataset.price);

    addItemToCart(name, price);

    updateCart();

    showCartAddedNotice(name);
  });
});

/* ============================================================
   ADD ITEM TO CART — REUSABLE
   ============================================================ */

function addItemToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1,
    });
  }
}

/* ============================================================
   ADD TO CART FROM MENU POPUP
   ============================================================ */

menuDetailAddBtn.addEventListener("click", (event) => {
  event.preventDefault();

  event.stopPropagation();

  const name = menuDetailAddBtn.dataset.name;

  const price = Number(menuDetailAddBtn.dataset.price);

  if (!name || Number.isNaN(price)) {
    return;
  }

  addItemToCart(name, price);

  updateCart();

  closeMenuDetails();

  showCartAddedNotice(name);
});

/* ============================================================
   ADDED TO ORDER NOTIFICATION
   ============================================================ */

function showCartAddedNotice(itemName) {
  const oldNotice = document.querySelector(".cart-added-notice");

  if (oldNotice) {
    oldNotice.remove();
  }

  const notice = document.createElement("div");

  notice.className = "cart-added-notice";

  notice.innerHTML = `
    <span class="cart-added-icon">
      ✓
    </span>

    <div>
      <strong>
        Added to your order
      </strong>

      <small>
        ${itemName} is in your cart.
      </small>
    </div>
  `;

  document.body.appendChild(notice);

  requestAnimationFrame(() => {
    notice.classList.add("show");
  });

  setTimeout(() => {
    notice.classList.remove("show");

    setTimeout(() => {
      notice.remove();
    }, 300);
  }, 2200);
}

/* ============================================================
   UPDATE CART
   ============================================================ */

function updateCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">

        <span>☕</span>

        <h3>
          Your order is empty
        </h3>

        <p>
          Add something delicious from the menu.
        </p>

      </div>
    `;

    cartTotal.textContent = "₱0";

    cartCount.textContent = "0";

    getReceiptBtn.disabled = true;

    return;
  }

  let total = 0;

  let itemCount = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

    total += itemTotal;

    itemCount += item.quantity;

    const cartItem = document.createElement("div");

    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div>

        <h4>
          ${item.name}
        </h4>

        <div class="cart-item-price">
          ₱${item.price.toLocaleString()}
        </div>

      </div>


      <div class="cart-item-controls">

        <button
          class="quantity-button"
          data-action="decrease"
          data-index="${index}"
        >
          −
        </button>

        <span class="quantity">
          ${item.quantity}
        </span>

        <button
          class="quantity-button"
          data-action="increase"
          data-index="${index}"
        >
          +
        </button>

      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `₱${total.toLocaleString()}`;

  cartCount.textContent = itemCount;

  getReceiptBtn.disabled = false;

  attachQuantityEvents();
}

/* ============================================================
   QUANTITY CONTROLS
   ============================================================ */

function attachQuantityEvents() {
  const quantityButtons = document.querySelectorAll(".quantity-button");

  quantityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);

      const action = button.dataset.action;

      if (action === "increase") {
        cart[index].quantity += 1;
      }

      if (action === "decrease") {
        cart[index].quantity -= 1;

        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }

      updateCart();
    });
  });
}

/* ============================================================
   RECEIPT ELEMENTS
   ============================================================ */

const receiptOverlay = document.getElementById("receiptOverlay");

const closeReceiptBtn = document.getElementById("closeReceiptBtn");

const receiptItems = document.getElementById("receiptItems");

const receiptTotal = document.getElementById("receiptTotal");

const receiptOrderNumber = document.getElementById("receiptOrderNumber");

const receiptDate = document.getElementById("receiptDate");

const copyReceiptBtn = document.getElementById("copyReceiptBtn");

const messengerBtn = document.getElementById("messengerBtn");

const copyStatus = document.getElementById("copyStatus");

/* ============================================================
   ORDER NUMBER
   ============================================================ */

function generateOrderNumber() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `#SUGAR-${randomNumber}`;
}

/* ============================================================
   CURRENT DATE
   ============================================================ */

function getCurrentDate() {
  const now = new Date();

  return now.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ============================================================
   GENERATE RECEIPT
   ============================================================ */

function generateReceipt() {
  if (cart.length === 0) {
    return;
  }

  receiptItems.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;

    total += itemTotal;

    const receiptItem = document.createElement("div");

    receiptItem.className = "receipt-item";

    receiptItem.innerHTML = `
      <div class="receipt-item-name">

        ${item.name}

        <span class="receipt-item-qty">
          × ${item.quantity}
        </span>

      </div>


      <div class="receipt-item-price">
        ₱${itemTotal.toLocaleString()}
      </div>
    `;

    receiptItems.appendChild(receiptItem);
  });

  receiptTotal.textContent = `₱${total.toLocaleString()}`;

  receiptOrderNumber.textContent = generateOrderNumber();

  receiptDate.textContent = getCurrentDate();

  receiptCustomerName.textContent = customerName.value.trim();

  receiptCustomerNumber.textContent = customerNumber.value.trim();

  receiptCustomerAddress.textContent = customerAddress.value.trim();

  copyReceiptBtn.classList.remove("hidden");

  messengerBtn.classList.add("hidden");

  copyStatus.textContent = "Copy your receipt before opening Messenger.";

  receiptOverlay.classList.add("active");
}

/* ============================================================
   GET RECEIPT
   ============================================================ */

getReceiptBtn.addEventListener("click", () => {
  if (!validateCustomerDetails()) {
    return;
  }

  generateReceipt();
});

/* ============================================================
   CLOSE RECEIPT
   ============================================================ */

closeReceiptBtn.addEventListener("click", () => {
  receiptOverlay.classList.remove("active");
});

/* ============================================================
   CLICK OUTSIDE RECEIPT
   ============================================================ */

receiptOverlay.addEventListener("click", (event) => {
  if (event.target === receiptOverlay) {
    receiptOverlay.classList.remove("active");
  }
});

/* ============================================================
   BUILD RECEIPT TEXT
   ============================================================ */

function buildReceiptText() {
  let text = "";

  text += "SUGAR CAFE\n";

  text += "Sweet moments, served fresh.\n";

  text += "--------------------------------\n";

  text += `Order: ${receiptOrderNumber.textContent}\n`;

  text += `Date: ${receiptDate.textContent}\n`;

  text += "--------------------------------\n";

  text += `Name: ${customerName.value.trim()}\n`;

  text += `Phone: ${customerNumber.value.trim()}\n`;

  text += `Address: ${customerAddress.value.trim()}\n`;

  text += "--------------------------------\n";

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;

    text += `${item.name} x${item.quantity} — ₱${itemTotal}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  text += "--------------------------------\n";

  text += `TOTAL: ₱${total}\n`;

  text += "--------------------------------\n";

  text += "Thank you for choosing Sugar Cafe!\n";

  text +=
    "Please send this receipt to us through Messenger to confirm your order.";

  return text;
}

/* ============================================================
   COPY RECEIPT
   ============================================================ */

copyReceiptBtn.addEventListener("click", async () => {
  const receiptText = buildReceiptText();

  try {
    await navigator.clipboard.writeText(receiptText);

    receiptCopiedSuccessfully();
  } catch (error) {
    const textArea = document.createElement("textarea");

    textArea.value = receiptText;

    textArea.style.position = "fixed";

    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);

    textArea.select();

    try {
      document.execCommand("copy");
    } catch (fallbackError) {
      console.error("Unable to copy receipt:", fallbackError);
    }

    textArea.remove();

    receiptCopiedSuccessfully();
  }
});

/* ============================================================
   AFTER COPYING RECEIPT
   ============================================================ */

function receiptCopiedSuccessfully() {
  copyReceiptBtn.classList.add("hidden");

  messengerBtn.classList.remove("hidden");

  copyStatus.textContent =
    "Receipt copied! Send it to Sugar Cafe through Messenger.";
}

/* ============================================================
   ESCAPE KEY
   ============================================================ */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  closeCart();

  closeMenuDetails();

  receiptOverlay.classList.remove("active");
});

/* ============================================================
   INITIAL CART STATE
   ============================================================ */

updateCart();

/* ============================================================
   DONE.
   Menu card → bigger picture + details.
   Add → cart.
   Outside/X → close.
   
   No scroll prison.
   No surprise cart teleportation.
   ============================================================ */
