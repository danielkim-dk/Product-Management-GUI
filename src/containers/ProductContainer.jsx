// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect } from 'react'
import { InventoryContext } from '../contexts/InventoryContext';
import Searchbar from '../components/Searchbar';
import './Containers.css';
import CardContainer from './CardContainer';

// The ProductContainer component is the parent component for the CardContainer and Searchbar components
function ProductContainer() {
    // InventoryContext is used to access the global state variables
    const { products } = useContext(InventoryContext);

    // These are the local state variables that will be used to filter the products state variable
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredProducts, setFilteredProducts] = useState(products);
    

    useEffect(() => {
        if (products && products.length > 0) {
            const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
            setCategories(['All', ...uniqueCategories]);
        }
    }, [products]);

    // This useEffect hook is used to filter the products state variable based on the searchKeyword and selectedCategory state variables
    // It has functionality to filter by UPC code
    // TODO: figure out actual inventory UPC codes
    // ? Stretch feature to have UPS scan auto load modal and fill with scale data
    useEffect(() => {
        if (products && products.length > 0) {
            const categoryFiltered = selectedCategory === 'All'
                ? products
                : products.filter(product => product.category === selectedCategory);

            const keywordFiltered = categoryFiltered.filter(product => {
                const productName = product.product?.toLowerCase() || '';
                const upcName = product.upc?.toString() || '';
                const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
                return productName.includes(lowerCaseSearchKeyword) || upcName.includes(lowerCaseSearchKeyword);
            });

            setFilteredProducts(keywordFiltered);
        }
    }, [selectedCategory, products, searchKeyword]); 

    // Sets selectedCategory state variable to the value of the dropdown menu
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };
    
    // Sets selectedCategory state variable to the value of Searchbar input
    const handleInputChange = (value) => {
        setSearchKeyword(value);
    };


    // The component returns a div that contains a Searchbar component, a category seelect dropdown, and a CardContainer component.
    // The Searchbar component calls the handleInputChange function when its input changes.
    // The select calls the handleCategoryChange function when its value changes.
    // The CardContainer component is passed the filteredProducts as a prop.
    return (
        <div className='ProductContainer'>
            <div className='SearchbarContainer'>
                <Searchbar onInputChange={handleInputChange} />
                <select id='sortByDrop' onChange={(e) => handleCategoryChange(e.target.value)}>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            <CardContainer products={filteredProducts} />
        </div>
    )
}

export default ProductContainer