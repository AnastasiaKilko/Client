let eventBus = new Vue();


Vue.component('info-tabs', {
    props: {
        details: {
            type: Array,
            required: true
        },
        sizes: {
            type: Array,
            required: true
        },
        shipping: {
            required: true
        }
    },
    template: `
    <div>
        <ul>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }" 
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
            >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Sizes'">
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Shipping'">
            <p>{{ shipping }}</p>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Details', 'Sizes', 'Shipping'],
            selectedTab: 'Details'
        }
    }
})


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
    <div>
        <ul>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }" 
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab" 
            >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                <p>Recommendation: {{ review.recommendation }}</p>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
        </div>  
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',
        }
    }
})


Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <label for="recommendation">Would you recommend this product?</label>
            <input class="rec-radio" id="recommendation" v-model="recommendation" type="radio" value="yes">yes
            <input class="rec-radio" id="recommendation" v-model="recommendation" type="radio" value="no">no
        </p>
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>    
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommendation) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommendation = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommendation) this.errors.push("Recommendation required.")
            }
        }

    }
})


Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
    `
})


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: {
            type: Array,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
            <a :href="link">More products like this</a>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <p v-if="inStock">In stock</p>
            <p v-else class="out-of-stock">
                Out of stock
            </p>
            <p>{{ sale }}</p>
            
            <info-tabs :details="details" :sizes="sizes" :shipping="shipping"></info-tabs>
            
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct (index) "
            >
            </div>
                    
            <div class="cart-buttons">
                <button
                        v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
                <button
                        v-on:click="removeFromCart"
                        :disabled="!inStock || !cart.length "
                        :class="{ disabledButton: !inStock || !cart.length }"
                >
                    Remove from cart
                </button>
            </div>
        </div>
        <product-tabs :reviews="reviews"></product-tabs>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks.",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=sock",
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 15
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
            this.variants[this.selectedVariant] .variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart',
                this.variants[this.selectedVariant] .variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }

    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant] .variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant] .variantQuantity;
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' — on sale!';
            }
            return this.brand + ' ' + this.product + ' — not on sale now';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        rollbackCart(id) {
            this.cart.pop();
        }
    }
})