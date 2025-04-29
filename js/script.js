document.addEventListener('DOMContentLoaded', function() {
    // Get all the elements we need
    const generateBtn = document.getElementById('generate-btn');
    const resultEnergy = document.getElementById('result-energy');
    const ratioContainer = document.getElementById('ratio-container');
    const resultContainer = document.querySelector('.result');
    const playerSwitch = document.getElementById('player-switch');
    const container = document.querySelector('.container');
    
    const energyTypes = [
        'grass', 'fire', 'water', 'lightning', 'psychic', 
        'fighting', 'darkness', 'metal', 'fairy'
    ];

    // Initialize player data storage
    const playerData = {
        player1: {},
        player2: {}
    };
    
    // Initialize player data with zeros for all energy types
    energyTypes.forEach(type => {
        playerData.player1[type] = 0;
        playerData.player2[type] = 0;
    });
    
    // Set initial active player
    let currentPlayer = 'player1';
    updatePlayerIndicator();
    
    // Create audio element for the reveal sound
    const revealSound = new Audio();
    revealSound.src = 'data:audio/wav;base64,UklGRqQJAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYAJAACAgICAgICAgICAgICAgICAgICAgICAgICAf3hxeH+AfXZ1eHx6fH58e3p5eXl6enp7fH1+f4CAgICAf3t8fHx9fn59fXx9fX5/gIGDhIWHiImKiouKioiHhoSCgH18e3p5eHd3d3h5ent9f4GDhYeJi4yOj5CRkZGQjo2LiYeEgoB+fHp4d3V0c3Nyc3R1d3l8f4KFiIuOkZOWmJqbnJ2dm5qYlpSSj42KiIWCf316eHZ0c3Fwb25vcHFydXd6fYCEh4qOkZSXmp2foKKjo6OioJ+dmpiVko+MiYaDgH16d3VzcXBubWxsbG1ucXN2eX1/g4aJjZCTlpmcnqCipKWlpKOhn52bmJWSkY6LiIWCf3x5d3Vzc3JycXFyc3R2eHp9gIOFiIqNkJKUlpmbnJ2enp6em5qYlpSSkI2LiYeEgn+9vLu7urm4t7a1tLSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERANDAkHBAIAAICBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7//v39/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKelpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERANDAkHBAIAAICBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7//v39/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKelpKOin52Cf4CAgICAgICAgICAgICAgICAgICAgICAgA==';
    
    // Function to generate a random energy card based on weights
    function generateRandomEnergy() {
        // Get values for current player
        const energyValues = getCurrentPlayerData();
        let totalWeight = 0;
        
        for (const type in energyValues) {
            totalWeight += energyValues[type];
        }
        
        // Check if any energy cost was entered
        if (totalWeight === 0) {
            alert('Please enter at least one energy cost!');
            return null;
        }
        
        // Generate random number between 0 and total weight
        const randomValue = Math.random() * totalWeight;
        
        // Determine selected energy based on weights
        let accumulatedWeight = 0;
        for (const type of energyTypes) {
            accumulatedWeight += energyValues[type];
            if (randomValue < accumulatedWeight) {
                return type;
            }
        }
        
        // Fallback (should not happen but just in case)
        return energyTypes[0];
    }
    
    // Function to get the current player's data
    function getCurrentPlayerData() {
        return playerData[currentPlayer];
    }
    
    // Function to update player indicator in UI
    function updatePlayerIndicator() {
        container.classList.remove('player-one-active', 'player-two-active');
        
        if (currentPlayer === 'player1') {
            container.classList.add('player-one-active');
        } else {
            container.classList.add('player-two-active');
        }
    }
    
    // Function to update input values based on the current player
    function updateInputsFromPlayerData() {
        const currentData = getCurrentPlayerData();
        
        energyTypes.forEach(type => {
            document.getElementById(type).value = currentData[type];
        });
        
        updateRatios();
    }
    
    // Display the selected energy with suspense and sound
    function displayEnergyWithSuspense(energyType) {
        if (!energyType) return;
        
        // Show spinner, hide result
        resultContainer.classList.add('loading');
        
        // After a delay between 1-2 seconds
        const delay = Math.random() * 1000 + 1000; // Random delay between 1-2 seconds
        
        setTimeout(() => {
            // Hide spinner, show result
            resultContainer.classList.remove('loading');
            
            // Clear any previous content
            resultEnergy.textContent = '';
            
            // Set the background image via class name
            resultEnergy.className = 'result-energy ' + energyType;
            
            // Play the reveal sound
            revealSound.play();
            
            // Add animation
            resultEnergy.style.animation = 'none';
            resultEnergy.offsetHeight; // Trigger reflow to restart animation
            resultEnergy.style.animation = 'pulse 0.5s';
        }, delay);
    }
    
    // Calculate and display ratios
    function updateRatios() {
        // Clear previous ratio display
        ratioContainer.innerHTML = '';
        
        // Get total and individual values from current player's data
        const energyValues = getCurrentPlayerData();
        let totalEnergy = 0;
        
        for (const type in energyValues) {
            totalEnergy += energyValues[type];
        }
        
        // Don't show ratios if total is zero
        if (totalEnergy === 0) {
            ratioContainer.innerHTML = '<p>No energy values set</p>';
            return;
        }
        
        // Create ratio items for each energy type that has a value
        energyTypes.forEach(type => {
            if (energyValues[type] > 0) {
                const ratio = ((energyValues[type] / totalEnergy) * 100).toFixed(1);
                
                const ratioItem = document.createElement('div');
                ratioItem.className = 'ratio-item';
                
                const ratioIcon = document.createElement('div');
                ratioIcon.className = 'ratio-icon ' + type;
                
                const ratioValue = document.createElement('span');
                ratioValue.className = 'ratio-value';
                ratioValue.textContent = `${ratio}%`;
                
                ratioItem.appendChild(ratioIcon);
                ratioItem.appendChild(ratioValue);
                ratioContainer.appendChild(ratioItem);
            }
        });
    }
    
    // Add animation keyframes to the document
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Save current input values to player data
    function saveInputValuesToPlayerData() {
        const currentData = getCurrentPlayerData();
        
        energyTypes.forEach(type => {
            const value = parseInt(document.getElementById(type).value) || 0;
            currentData[type] = value;
        });
    }
    
    // Add event listener to the generate button
    generateBtn.addEventListener('click', function() {
        const selectedEnergy = generateRandomEnergy();
        if (selectedEnergy) {
            displayEnergyWithSuspense(selectedEnergy);
        }
    });
    
    // Add event listeners to all number inputs to ensure they're non-negative and update ratios and player data
    energyTypes.forEach(type => {
        const input = document.getElementById(type);
        input.addEventListener('change', function() {
            if (this.value < 0) this.value = 0;
            saveInputValuesToPlayerData();
            updateRatios();
        });
        input.addEventListener('input', function() {
            saveInputValuesToPlayerData();
            updateRatios();
        });
    });
    
    // Add event listener to player toggle switch
    playerSwitch.addEventListener('change', function() {
        // Save current input values before switching
        saveInputValuesToPlayerData();
        
        // Switch player
        currentPlayer = this.checked ? 'player2' : 'player1';
        
        // Update player indicator and inputs
        updatePlayerIndicator();
        updateInputsFromPlayerData();
    });
    
    // Initialize ratio display
    updateRatios();
});