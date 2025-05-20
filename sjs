[1mdiff --git a/.env b/.env[m
[1mindex 16681d4..f0c645b 100644[m
[1m--- a/.env[m
[1m+++ b/.env[m
[36m@@ -1,2 +1,2 @@[m
[31m-# REACT_APP_BACKEND_URL=https://diagnosticcenter.in[m
[31m-REACT_APP_BACKEND_URL=https://bms-hek7.onrender.com[m
\ No newline at end of file[m
[32m+[m[32mREACT_APP_BACKEND_URL=https://diagnosticcenter.in[m
[32m+[m[32m# REACT_APP_BACKEND_URL=https://bms-hek7.onrender.com[m
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex b28b2ad..ee9a754 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -12,6 +12,7 @@[m
         "@testing-library/react": "^13.4.0",[m
         "@testing-library/user-event": "^13.5.0",[m
         "axios": "^1.7.7",[m
[32m+[m[32m        "http-proxy-middleware": "^3.0.3",[m
         "react": "^18.3.1",[m
         "react-dom": "^18.3.1",[m
         "react-icons": "^5.3.0",[m
[36m@@ -9355,26 +9356,19 @@[m
       }[m
     },[m
     "node_modules/http-proxy-middleware": {[m
[31m-      "version": "2.0.6",[m
[31m-      "resolved": "https://registry.npmjs.org/http-proxy-middleware/-/http-proxy-middleware-2.0.6.tgz",[m
[31m-      "integrity": "sha512-ya/UeJ6HVBYxrgYotAZo1KvPWlgB48kUJLDePFeneHsVujFaW5WNj2NgWCAE//B1Dl02BIfYlpNgBy8Kf8Rjmw==",[m
[32m+[m[32m      "version": "3.0.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/http-proxy-middleware/-/http-proxy-middleware-3.0.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-usY0HG5nyDUwtqpiZdETNbmKtw3QQ1jwYFZ9wi5iHzX2BcILwQKtYDJPo7XHTsu5Z0B2Hj3W9NNnbd+AjFWjqg==",[m
       "dependencies": {[m
[31m-        "@types/http-proxy": "^1.17.8",[m
[32m+[m[32m        "@types/http-proxy": "^1.17.15",[m
[32m+[m[32m        "debug": "^4.3.6",[m
         "http-proxy": "^1.18.1",[m
[31m-        "is-glob": "^4.0.1",[m
[31m-        "is-plain-obj": "^3.0.0",[m
[31m-        "micromatch": "^4.0.2"[m
[32m+[m[32m        "is-glob": "^4.0.3",[m
[32m+[m[32m        "is-plain-object": "^5.0.0",[m
[32m+[m[32m        "micromatch": "^4.0.8"[m
       },[m
       "engines": {[m
[31m-        "node": ">=12.0.0"[m
[31m-      },[m
[31m-      "peerDependencies": {[m
[31m-        "@types/express": "^4.17.13"[m
[31m-      },[m
[31m-      "peerDependenciesMeta": {[m
[31m-        "@types/express": {[m
[31m-          "optional": true[m
[31m-        }[m
[32m+[m[32m        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"[m
       }[m
     },[m
     "node_modules/https-proxy-agent": {[m
[36m@@ -9839,6 +9833,14 @@[m
         "url": "https://github.com/sponsors/sindresorhus"[m
       }[m
     },[m
[32m+[m[32m    "node_modules/is-plain-object": {[m
[32m+[m[32m      "version": "5.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/is-plain-object/-/is-plain-object-5.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-VRSzKkbMm5jMDoKLbltAkFQ5Qr7VDiTFGXxYFXXowVj387GeGNOCsOH6Msy00SGZ3Fp84b1Naa1psqgcCIEP5Q==",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=0.10.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/is-potential-custom-element-name": {[m
       "version": "1.0.1",[m
       "resolved": "https://registry.npmjs.org/is-potential-custom-element-name/-/is-potential-custom-element-name-1.0.1.tgz",[m
[36m@@ -17576,6 +17578,29 @@[m
         }[m
       }[m
     },[m
[32m+[m[32m    "node_modules/webpack-dev-server/node_modules/http-proxy-middleware": {[m
[32m+[m[32m      "version": "2.0.7",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/http-proxy-middleware/-/http-proxy-middleware-2.0.7.tgz",[m
[32m+[m[32m      "integrity": "sha512-fgVY8AV7qU7z/MmXJ/rxwbrtQH4jBQ9m7kp3llF0liB7glmFeVZFBepQb32T3y8n8k2+AEYuMPCpinYW+/CuRA==",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@types/http-proxy": "^1.17.8",[m
[32m+[m[32m        "http-proxy": "^1.18.1",[m
[32m+[m[32m        "is-glob": "^4.0.1",[m
[32m+[m[32m        "is-plain-obj": "^3.0.0",[m
[32m+[m[32m        "micromatch": "^4.0.2"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=12.0.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@types/express": "^4.17.13"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependenciesMeta": {[m
[32m+[m[32m        "@types/express": {[m
[32m+[m[32m          "optional": true[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "node_modules/webpack-dev-server/node_modules/ws": {[m
       "version": "8.18.0",[m
       "resolved": "https://registry.npmjs.org/ws/-/ws-8.18.0.tgz",[m
[1mdiff --git a/package.json b/package.json[m
[1mindex f2332fc..8cb92f6 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -7,6 +7,7 @@[m
     "@testing-library/react": "^13.4.0",[m
     "@testing-library/user-event": "^13.5.0",[m
     "axios": "^1.7.7",[m
[32m+[m[32m    "http-proxy-middleware": "^3.0.3",[m
     "react": "^18.3.1",[m
     "react-dom": "^18.3.1",[m
     "react-icons": "^5.3.0",[m
[1mdiff --git a/src/features/BorrowerSchemePages/DailySchemeBorrower.jsx b/src/features/BorrowerSchemePages/DailySchemeBorrower.jsx[m
[1mindex cfb6554..8b2c6e7 100644[m
[1m--- a/src/features/BorrowerSchemePages/DailySchemeBorrower.jsx[m
[1m+++ b/src/features/BorrowerSchemePages/DailySchemeBorrower.jsx[m
[36m@@ -585,9 +585,9 @@[m [mconst DailySchemeBorrower = () => {[m
               {/* New section for total amounts */}[m
               <div className="mb-4 p-4 bg-gray-100 rounded-lg flex justify-between">[m
                 <div className="text-lg font-semibold">[m
[31m-                  <div>Total Demanded Amount: ₹{totalDemandedAmount}</div>[m
[32m+[m[32m{/*                   <div>Total Demanded Amount: ₹{totalDemandedAmount}</div> */}[m
                   <div>Total Paid Amount: ₹{totalPaidAmount}</div>[m
[31m-                  <div>Total Pending Amount: ₹{totalPendingAmount}</div>[m
[32m+[m[32m{/*                   <div>Total Pending Amount: ₹{totalPendingAmount}</div> */}[m
                 </div>[m
                 <div className="text-lg font-semibold text-green-600">[m
                   {installments.filter((inst) => inst.paid).length}{" "}[m
[36m@@ -737,4 +737,4 @@[m [mconst DailySchemeBorrower = () => {[m
   );[m
 };[m
 [m
[31m-export default DailySchemeBorrower;[m
\ No newline at end of file[m
[32m+[m[32mexport default DailySchemeBorrower;[m
[1mdiff --git a/src/features/BorrowerSchemePages/MonthlySchemeBorrower.jsx b/src/features/BorrowerSchemePages/MonthlySchemeBorrower.jsx[m
[1mindex dfab95e..035c458 100644[m
[1m--- a/src/features/BorrowerSchemePages/MonthlySchemeBorrower.jsx[m
[1m+++ b/src/features/BorrowerSchemePages/MonthlySchemeBorrower.jsx[m
[36m@@ -783,4 +783,4 @@[m [mconst MonthlySchemeBorrower = () => {[m
   );[m
 };[m
 [m
[31m-export default MonthlySchemeBorrower;[m
\ No newline at end of file[m
[32m+[m[32mexport default MonthlySchemeBorrower;[m
[1mdiff --git a/src/pages/AccountManagement.jsx b/src/pages/AccountManagement.jsx[m
[1mindex e86090a..61ca3ef 100644[m
[1m--- a/src/pages/AccountManagement.jsx[m
[1m+++ b/src/pages/AccountManagement.jsx[m
[36m@@ -1,220 +1,220 @@[m
[31m-import React, { useState, useEffect } from "react";[m
[31m-import axios from "axios";[m
[31m-[m
[31m-// Utility function to format date to dd/mm/yyyy[m
[31m-const formatDate = (dateString) => {[m
[31m-  const date = new Date(dateString);[m
[31m-  const day = String(date.getDate()).padStart(2, '0');[m
[31m-  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based[m
[31m-  const year = date.getFullYear();[m
[31m-  return `${day}/${month}/${year}`;[m
[31m-};[m
[31m-[m
[31m-const AccountManagement = () => {[m
[31m-  // State variables[m
[31m-  const [startDate, setStartDate] = useState("");[m
[31m-  const [endDate, setEndDate] = useState("");[m
[31m-  const [isDaily, setIsDaily] = useState(true);[m
[31m-  const [borrowers, setBorrowers] = useState