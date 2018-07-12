/* eslint-disable import/first */

import { formatPrice } from '../../helpers';
import * as chroma from 'chroma-js';
window.chroma = chroma;

export default {
  props: ['productId'],

  computed: {
    product() { return this.$store.state.products.find(p => p.id === this.productId); },
    // (most recent entry for this product)
    // eslint-disable-next-line max-len
    productInCart() { return this.$store.state.cart.filter(({ id }) => id === this.product.id).slice(-1)[0]; },
    colorInCart() { return (this.productInCart || {}).color; },
    sizeInCart() { return (this.productInCart || {}).size; },
    quantityInCart() { return this.productInCart ? this.productInCart.quantity : 1; },

    buttonMessage() {
      const p = this.$store.state.cart.find(({ id, color, size }) =>
        id === this.product.id && color === this.selectedColor && size === this.selectedSize);
      if (p) return p.quantity === this.selectedQuantity ? 'Added!' : 'Update quantity';
      return 'Add to cart';
    },

    buttonDisabled() {
      return (this.product.options.colors.length && !this.selectedColor)
        || (this.product.options.sizes.length && !this.selectedSize);
    },

    imageShadow() {
      const color = chroma(this.selectedColor || 'black').desaturate(2).darken(3).alpha(0.25);
      return `0 1.1vh 4.7vh ${color.css()}`;
    },
  },

  data: () => ({
    selectedColor: undefined,
    selectedSize: undefined,
    selectedQuantity: 1,
  }),

  async beforeMount() {
    // Wait for productsFetched mutation in Vuex before proceeding to ensure that products are
    // populated with an API result
    if (!this.$store.state.productsFetched) {
      await new Promise((resolve) => {
        this.$store.subscribe((mutation) => {
          if (mutation.type === 'productsFetched') resolve();
        });
      });
    }

    this.selectedColor = this.colorInCart;
    this.selectedSize = this.sizeInCart;
    this.selectedQuantity = this.quantityInCart;

    if (!this.selectedColor && this.product.options.colors.length === 1) {
      this.selectedColor = this.product.options.colors[0];
    }
    if (!this.selectedSize && this.product.options.sizes.length === 1) {
      this.selectedSize = this.product.options.sizes[0];
    }
  },

  methods: {
    formatPrice,

    addToCart() {
      this.$store.commit('cartUpdate', {
        id: this.product.id,
        color: this.selectedColor,
        size: this.selectedSize,
        quantity: this.selectedQuantity,
      });
    },
  },
};
