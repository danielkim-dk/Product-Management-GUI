// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { InventoryContext } from '../contexts/InventoryContext';
import './Components.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function CurrentLossGraph() {
    const { categoryInventory } = useContext(InventoryContext);
    
    const inventoryWeight = categoryInventory
        .filter(item => item.bucket_name === 'inventory')
        .reduce((acc, curr) => acc + parseFloat(curr.total_weight || 0), 0);

    const lossWeight = categoryInventory
        .filter(item => item.bucket_name === 'loss')
        .reduce((acc, curr) => acc + parseFloat(curr.total_weight || 0), 0);

    const doughnutData = {
        labels: ['Inventory', 'Loss'],
        datasets: [{
            label: 'Total Pounds',
            data: [inventoryWeight, lossWeight], // First element is inventory weight, second is loss weight
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
