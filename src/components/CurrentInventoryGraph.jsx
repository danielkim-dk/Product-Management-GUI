// eslint-disable-next-line no-unused-vars
import React, { useContext, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { InventoryContext } from '../contexts/InventoryContext';
import './Components.css';

// Register necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// The CurrentInventoryGraph component is responsible for displaying a bar graph of the current inventory.
function CurrentInventoryGraph() {
    // Use the InventoryContext to get the category inventory
    const { categoryInventory } = useContext(InventoryContext);

    // Prepare the data for the bar graph using useMemo for performance optimization
    const chartData = useMemo(() => {
        const filteredInventory = categoryInventory.filter(item => item.bucket_name === 'inventory');

        const categories = filteredInventory.map(item => item.category);
        const counts = filteredInventory.map(item => parseFloat(item.total_weight) || 0);

        return {
            labels: categories,
            datasets: [{
                label: 'Inventory Count by Pounds',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
    }, [categoryInventory]);
    
    // Define the options for the bar graph
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    font: { 
                        size: 14
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 15
                    }
                }
            },
            y: {
                ticks: {
                    font: {
                        size: 15
                    }
                }
            }
        }
    };

    // The Bar component is only rendered if categoryInventory is not empty.
    return (
        <div className='currentInventoryGraph'>
            {categoryInventory && categoryInventory.length > 0 && <Bar data={chartData} options={chartOptions} />}
        </div>
    );
}

export default CurrentInventoryGraph;