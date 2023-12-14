// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect } from 'react'
import { InventoryContext } from '../contexts/InventoryContext';
import Searchbar from '../components/Searchbar';
import './Containers.css';
import CardContainer from './CardContainer';


function ProductContainer() {
    const { products, getProducts } = useContext(InventoryContext);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState(products);
    
    useEffect(() => {
        if (products && products.length > 0) {
            const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
            setCategories(['all', ...uniqueCategories]);
        }
    }, [products]);

    useEffect(() => {
        if (products && products.length > 0) {
            const categoryFiltered = selectedCategory === 'all'
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


    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    }

    const handleInputChange = (value) => {
        setSearchKeyword(value);
        console.log(products)
    }


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