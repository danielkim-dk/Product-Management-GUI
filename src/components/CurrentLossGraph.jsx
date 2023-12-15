// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { InventoryContext } from '../contexts/InventoryContext';
import './Components.css';

// Register necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// The CurrentLossGraph component is responsible for displaying a doughnut graph of the current loss and inventory.
function CurrentLossGraph() {
    // Use the InventoryContext to get the category inventory
    const { categoryInventory } = useContext(InventoryContext);
    
    // Calculate the total weight of the inventory
    const inventoryWeight = categoryInventory
        .filter(item => item.bucket_name === 'inventory')
        .reduce((acc, curr) => acc + parseFloat(curr.total_weight || 0), 0);

    // Calculate the total weight of the loss
    const lossWeight = categoryInventory
        .filter(item => item.bucket_name === 'loss')
        .reduce((acc, curr) => acc + parseFloat(curr.total_weight || 0), 0);

    // Prepare the data for the doughnut graph
    const doughnutData = {
        labels: ['Inventory', 'Loss'],
        datasets: [{
            label: 'Total Pounds',
            data: [inventoryWeight, lossWeight],
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    };

    return (
        <div className='currentLossGraph'>
            <Doughnut data={doughnutData} />
        </div>
    );
}

export default CurrentLossGraph;
