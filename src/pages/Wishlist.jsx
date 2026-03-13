import React, { useState, useEffect } from 'react';
import './Wishlist.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import WishlistItemCard from '../components/WishlistItemCard';
import Footer from '../components/Footer';

function Wishlist({ onAddToCart }) {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [justForYouItems, setJustForYouItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setLoading(false);
            setWishlistItems([]);
        }
        fetchJustForYou();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('wishlists')
                .select(`
                    id,
                    product_id,
                    products (*)
                `)
                .eq('user_id', user.id);

            if (error) throw error;
            
            // Transform to match exactly what WishlistItemCard expects
            const formattedItems = (data || []).map(item => ({
                id: item.product_id, // we use product_id as the main id for UI components
                wishlist_id: item.id, // keep track of the wishlist row id for deletion
                name: item.products.title,
                price: item.products.price,
                before_price: item.products.compare_at_price,
                discount: item.products.compare_at_price > item.products.price 
                    ? Math.round(((item.products.compare_at_price - item.products.price) / item.products.compare_at_price) * 100) 
                    : null,
                image: item.products.image_urls?.[0] || 'https://via.placeholder.com/300'
            }));
            
            setWishlistItems(formattedItems);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchJustForYou = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .limit(4);

            if (error) throw error;
            
            const formattedItems = (data || []).map(p => ({
                ...p,
                name: p.title,
                image: p.image_urls?.[0] || 'https://via.placeholder.com/300',
                discount: p.compare_at_price > p.price 
                    ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100) 
                    : null,
                before_price: p.compare_at_price
            }));
            
            setJustForYouItems(formattedItems);
        } catch (err) {
            console.error("Error fetching just for you items:", err);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        if (!user) return;
        
        try {
            // Find the wishlist row id based on the product id
            const itemToRemove = wishlistItems.find(item => item.id === productId);
            if (!itemToRemove) return;

            const { error } = await supabase
                .from('wishlists')
                .delete()
                .eq('id', itemToRemove.wishlist_id);

            if (error) throw error;
            
            setWishlistItems(wishlistItems.filter(item => item.id !== productId));
        } catch (err) {
            console.error("Error removing from wishlist:", err);
        }
    }

    const handleMoveAllToBag = () => {
        wishlistItems.forEach(item => {
            onAddToCart(item);
        });
        setWishlistItems([]);
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-section">
                <div className="wishlist-header">
                    <h2>Wishlist ({wishlistItems.length})</h2>
                    <button className="wishlist-header-btn" onClick={handleMoveAllToBag}>Move All To Bag</button>
                </div>
                {loading ? (
                    <div className="py-12 text-center text-gray-500 font-poppins w-full">Loading wishlist...</div>
                ) : !user ? (
                    <div className="py-12 text-center text-gray-500 font-poppins w-full">Please login to save your wishlist items.</div>
                ) : wishlistItems.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 font-poppins w-full">Your wishlist is currently empty.</div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlistItems.map(item => (
                            <WishlistItemCard
                                key={item.id}
                                product={item}
                                variant="wishlist"
                                onAddToCart={onAddToCart}
                                onRemove={handleRemoveFromWishlist}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="wishlist-section jfy-section">
                <div className="wishlist-header">
                    <div className="jfy-title">
                        <div className="red-rect"></div>
                        <h2>Just For You</h2>
                    </div>
                    <button className="wishlist-header-btn">See All</button>
                </div>

                <div className="wishlist-grid">
                    {justForYouItems.map(item => (
                        <WishlistItemCard
                            key={item.id}
                            product={item}
                            variant="just-for-you"
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            </div>

            <div className='footer' style={{ marginTop: '4rem' }}>
                <Footer />
            </div>
        </div>
    );
}

export default Wishlist;
