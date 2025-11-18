# 🌐 Cloud Resource Marketplace (IaaS + SaaS Platform)

A cloud marketplace where **clients lease their computing resources** to users.  
Users can **create, start, stop, inspect, and execute commands** inside Virtual Machines (VMs) that run on distributed client nodes.

The system uses:

- **Docker** for lightweight virtualization  
- **Kubernetes** for multi-tenant isolation  
- **WebSockets** for real-time orchestration  
- **MongoDB** for persistence  
- **React.js** SaaS Dashboard  
- **Node.js Backend** communicating with distributed Client Agents  

---

## 🎯 Goal & Project Statement

The goal of the project is to build a **cloud marketplace** where client machines lease their computing power to users.  
Users create and manage VMs based on required **CPU, RAM, and Storage**, while distributed clients execute these VM workloads.  

The platform ensures **isolation using Docker/Kubernetes** and uses **real-time WebSockets** to manage VM lifecycle operations across multiple agent PCs.

### The project includes:
1. **Central Backend Server**
2. **Distributed Client Agents (Workers)**
3. **SaaS Dashboard (User Portal)**
4. **Multi-tenancy & Isolation**

---

## ☁️ Cloud Services Provided

| Service Type | What This Project Provides |
|--------------|----------------------------|
| **IaaS**     | Virtual machines, compute leasing, containerized isolation, VM provisioning |
| **SaaS**     | Cloud management dashboard, admin panel, user portal, 2FA login |

---

## 🏗️ Architecture Diagram


![Architecture Diagram](docs/architecture.png)

---

## 👤 User Sequence Diagram
> (User login → dashboard → create VM → backend → client agent → VM created)

![User Sequence Diagram](docs/user-sequence.png)

---

## 🛠️ Admin Sequence Diagram

![Admin Sequence Diagram](docs/admin-sequence.png)

---

## 🗄️ Database Diagram

![DB Diagram](docs/db-diagram.png)

---

## 🔧 Technology Stack

### 🖥️ **Software Used**
- **Operating Systems:** Ubuntu & Windows  
- **Backend:** Node.js + Express.js  
- **Frontend:** React.js (SaaS Dashboard)  
- **Database:** MongoDB  
- **Virtualization:** Docker  
- **Orchestration:** Kubernetes (Minikube / Kind / K3s)  
- **Authentication:** JWT + Nodemailer OTP (2FA)  
- **Monitoring (Optional):** Prometheus + Grafana  
- **Tools:** VS Code, Git/GitHub, Postman  

### 🖥️ **Hardware Used**
- Multiple PCs connected on the same LAN network  
- **1 PC for Backend Server**  
- **2+ PCs for Client Agents (VM Executors)**  

---

## 🚀 Features

### ✔ For Users
- Register & login with **2FA OTP**
- Create VM (choose CPU, RAM, Storage, OS)
- Start / Stop VM
- Execute commands inside VM (`exec-vm`)
- View list of only their VMs
- Real-time VM status

### ✔ For Admin
- View all users  
- View all client PCs (agents)  
- View all VMs across the system  
- Monitor connected machines in real time  

---

## 🧠 How the System Works (Flow)

### 1️⃣ **User Flow**
1. User logs in (JWT + OTP verification)
2. Opens SaaS dashboard
3. Requests VM creation → Dashboard → Backend
4. Backend selects the best connected client agent  
5. Sends WebSocket command: **"create-vm"**
6. Client agent runs Docker container → returns VM ID  
7. Backend stores VM in MongoDB  
8. User sees VM in dashboard

### 2️⃣ **VM Lifecycle**
- **Start VM** → backend → agent → container starts  
- **Stop VM** → backend → agent → container stops  
- **Inspect VM** → backend → agent → Docker inspect  
- **Exec Command** → backend → agent → container exec  

### 3️⃣ **Admin Flow**
- Login  
- View all users  
- View every connected client  
- View all VMs, their owners, and status  

---

## 🔌 API Endpoints

### 🧑‍💻 **User Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login (OTP sent) |
| POST | `/auth/verify-otp` | Verify OTP and get access token |
| POST | `/vms/create` | Create VM |
| GET | `/vms/my` | Get user's VMs |
| POST | `/vms/start/:vmId` | Start VM |
| POST | `/vms/stop/:vmId` | Stop VM |
| POST | `/vms/exec` | Execute command inside VM |
| GET | `/vms/:vmId` | Get VM details |

### 🛡️ **Admin Endpoints**
| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/auth/login` | Admin login |
| GET | `/admin/users` | List users |
| GET | `/admin/clients` | List all client PCs |
| GET | `/admin/vms` | List all VMs |
| GET | `/admin/vms/:vmId` | VM details |
| GET | `/admin/vms/client/:clientId` | VMs for specific client |

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/<repo-name>
cd <repo-name>

