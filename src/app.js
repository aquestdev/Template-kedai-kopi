document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    // item Menu Pada Web Nya Untuk Menambahkan Produck Tinggal copy di bagian item dan menambahkan fotonya
    items: [
      { id: 1, name: "Robusta Brazil", img: "m1.jpg", price: 20000 },
      { id: 2, name: "Espresso", img: "m2.jpg", price: 25000 },
      { id: 3, name: "Americano", img: "m3.jpg", price: 30000 },
      { id: 4, name: "Japanese Coffee", img: "m4.jpg", price: 40000 },
      { id: 5, name: "Italiano", img: "m5.jpg", price: 35000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di dalam bag-cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // Jika Belum Ada Maka
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika Barang Sudah Ada Maka Lakukan Hal Berikut
        this.items = this.items.map((item) => {
          // Jika barang nya berbeda Maka Bedakan Dan Jika barangnya sama Maka satukan
          if (item.id !== newItem.id) {
            return item;
          } else {
            // ketika barang sudah ada maka tambahkan sub total nya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // Jika item di kurangi maka
      const cartItem = this.items.find((item) => item.id === id);

      // Jika barang lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1-1
        this.items = this.items.map((item) => {
          // Jika bukan barang yang sama kita skip
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");
form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});
// kirim data ketika tomol checkout di klik
// checkoutButton.addEventListener("click", function (e) {
//   e.preventDefault();
//   const formData = new FormData(form);
//   const data = new URLSearchParams(formData);
//   const objData = Object.fromEntries(data);
//   const message = formatMessage(objData);
//   window.open(
//     "http://wa.me/62895333707700?text=" + encodeURIComponent(message)
//   );
// });
// // Format Pesan Ke Whatsapp
// const formatMessage = (obj) => {
//   return `Data Costumer
//     Nama : $(obj.name)
//     Email : $(obj.email)
//     No HP : $(obj.phone)
//     Data Pesanan
//     ${JSON.parse(obj.items).map(
//       (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
//     )}
//     TOTAL: ${rupiah(obj.total)}
//     Terima kasih.`;
// };

// Konversi Ke Mata Uang IDR
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
