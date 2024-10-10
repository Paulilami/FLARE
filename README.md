
# FLARE: Fast Lightweight Authenticated Relay for Drones (Version 1.1.0)

FLARE is a lightweight peer-to-peer communication system designed to coordinate multiple drones using a Federated Gossip Protocol over UDP. It is highly efficient, easy to install, and can run on almost any type of drone.

## Overview
FLARE is a robust, decentralized communication protocol designed to manage and coordinate multiple drones in various operations such as search, rescue, and surveillance. The project uses a lightweight Federated Gossip Protocol over UDP, enabling low-latency, reliable communication between drones.

### Key Features
- **Federated Gossip Protocol:** Reliable peer-to-peer communication between drones using UDP.
- **Dynamic Role Assignment:** Drones are assigned roles like Search, Front, or Back based on user configuration.
- **Protocol Flexibility:** Supports multiple operational protocols such as Search, Rescue, and Surveillance.
- **Google Maps Integration:** Real-time tracking and visualization using Google Maps.

## Requirements
- **Node.js** (v14+)
- **npm** (Node Package Manager)
- **Bash** (for running setup scripts)
- **Linux** or **macOS** operating system
- **Google Maps API Key** (for map visualization)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Paulilami/FLARE.git
cd FLARE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:

```bash
touch .env
```

**Example `.env` file:**
```dotenv
UDP_SERVER_PORT=5000
UDP_CLIENT_PORT=6001
DRONE_ID=drone1
MAPS_API_KEY=your_google_maps_api_key
```

### 4. Run the Application
Start the FLARE system:

```bash
node src/main.js
```

## Testing the System

### Run Tests
Run the unit tests to validate individual modules and functionalities:

```bash
npx mocha tests/**/*.test.js
```

### Simulate Multiple Drones
You can simulate multiple drones by starting additional instances with different IDs and UDP ports:

```bash
DRONE_ID=drone2 UDP_CLIENT_PORT=6002 node src/main.js
DRONE_ID=drone3 UDP_CLIENT_PORT=6003 node src/main.js
```

## Usage Instructions

### Command Usage in REPL
1. Open a REPL terminal:

   ```bash
   node
   ```

2. Load DroneControl:
   ```javascript
   const { startCommand, flyCommand, stopCommand } = require('./src/drones/DroneControl');
   ```

3. Issue Commands:
   - **Start Drones:**
     ```javascript
     startCommand();
     ```
   - **Fly Drones to 10 Meters:**
     ```javascript
     flyCommand(10);
     ```
   - **Stop Drones:**
     ```javascript
     stopCommand();
     ```

### Execute Protocols
To execute a specific protocol, use the following commands in the main menu or directly in REPL:

**Search Protocol:**
```javascript
const ProtocolManager = require('./src/system/ProtocolManager');
ProtocolManager.executeProtocol('search', {});
```

**Rescue Protocol:**
```javascript
ProtocolManager.executeProtocol('rescue', { targetLocation: { x: 50, y: 100 } });
```

**Surveillance Protocol:**
```javascript
ProtocolManager.executeProtocol('surveillance', { patrolRoute: [{ x: 0, y: 0 }, { x: 50, y: 50 }] });
```

## Real-Time Visualization Using Google Maps
To view real-time drone positions on Google Maps:

1. Open the Map View from the main menu:
   ```javascript
   openMap();
   ```

2. Ensure the `MAPS_API_KEY` is correctly set in the `.env` file.

## System Architecture
The FLARE system is organized as follows:

```
FLARE/
├── docs/
├── src/
│   ├── drones/                                      # Drone-specific configurations and management
│   │   ├── DroneSetup.js                            # Initialization and configuration of individual drones
│   │   ├── DroneControl.js                          # Centralized drone control commands (Start, Fly, etc.)
│   │   ├── DroneRegister.js                         # Register for tracking active drones, roles, and status
│   ├── communication/                               # All communication logic
│   │   ├── gossip/                                  # Gossip protocol implementation
│   │   └── udp/                                     # UDP socket management
│   ├── system/                                      # High-level system management
│   │   ├── FLARESystem.js                           # Main workflow and system commands
│   │   ├── RoleManager.js                           # Role assignments and reconfiguration logic
│   └── main.js                                      # Entry point for initializing and running FLARE
├── tests/                                           # Test files for different modules
├── scripts/                                         # Automation scripts
├── config/                                          # Configuration files for the entire system
├── README.md                                        # Primary project documentation
├── LICENSE                                          # Open-source license details
├── package.json                                     # Node.js dependencies and project metadata
└── .env                                             # Environment variables for the project
```

## Versioning
- **Current Version:** 1.1.0

## License
This project is licensed under the MIT License.

## Author
FLARE Development Team
