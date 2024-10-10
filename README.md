
# **FLARE: Fast Lightweight Authenticated Relay for Drones**

FLARE is a lightweight peer-to-peer communication system designed to coordinate multiple drones using a Federated Gossip Protocol over UDP. It is highly efficient, easy to install, and can run on almost any type of drone.

## **For Developers**

### **Setup**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/FLARE.git
   cd FLARE
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
   **Example `.env` file**:
   ```bash
   UDP_SERVER_PORT=5000
   UDP_CLIENT_PORT=6001
   DRONE_ID=drone1
   ```

4. **Run the Application**:
   ```bash
   node src/main.js
   ```

### **Testing**

1. **Run Tests**:
   ```bash
   npx mocha tests/**/*.test.js
   ```

2. **Start Multiple Drones**:
   ```bash
   DRONE_ID=drone2 UDP_CLIENT_PORT=6002 node src/main.js
   DRONE_ID=drone3 UDP_CLIENT_PORT=6003 node src/main.js
   ```

### **Command Usage in REPL**

1. Open a REPL terminal:
   ```bash
   node
   ```
2. Load DroneControl:
   ```javascript
   const { startCommand, flyCommand, stopCommand } = require('./src/drones/DroneControl');
   ```
3. Issue Commands:
   - **Start Drones**:
     ```javascript
     startCommand();
     ```
   - **Fly Drones**:
     ```javascript
     flyCommand(10);
     ```
   - **Stop Drones**:
     ```javascript
     stopCommand();
     ```

---

## **For Drone Users**

### **Setup Drones**

1. **Connect Each Drone**: Plug in each drone to your computer.
2. **Install Protocol**:
   ```bash
   ./scripts/setupDrone.sh <DRONE_IP> <DRONE_PORT> <DRONE_ID>
   ```

### **Usage**

1. **Start Drones**:
   ```javascript
   startCommand();
   ```
2. **Fly**:
   ```javascript
   flyCommand(10);
   ```
3. **Stop**:
   ```javascript
   stopCommand();
   ```

Enjoy using FLARE!
