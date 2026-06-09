<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App Preview</title>
   
    <!-- React and ReactDOM -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
   
    <!-- Babel for JSX transformation -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>


    <!-- Internal Styles -->
    <style>
        /* Global Reset & Body */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          /* Realistic background for glass effect - Yosemite Valley */
          background: url('https://images.pexels.com/photos/2583833/pexels-photo-2583833.jpeg?_gl=1*11rkdrm*_ga*MTYyNzI2NDY1My4xNzcwODgxMDUy*_ga_8JE65Q40S6*czE3NzA4ODEwNTIkbzEkZzEkdDE3NzA4ODEwNzUkajM3JGwwJGgw') no-repeat center center fixed;
          background-size: cover;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }


        /* Container Card - Glassmorphism */
        .todo-container {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          text-align: center;
          transition: transform 0.3s ease;
        }


        .todo-container:hover {
          transform: translateY(-5px);
        }


        h2 {
          margin-top: 0;
          color: #fff;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }


        /* Input Group */
        .input-group {
          display: flex;
          margin-bottom: 20px;
          gap: 10px;
        }


        input {
          flex: 1;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
        }


        input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }


        input:focus {
          border-color: #fff;
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }


        button {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 16px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }


        button:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }


        button:active {
          transform: scale(0.95);
        }


        /* List Styles */
        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }


        li {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 10px;
          padding: 12px 15px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          animation: fadeIn 0.4s ease-out;
          transition: all 0.2s ease;
        }


        li:hover {
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }


        /* Delete Button */
        .delete-btn {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
          font-size: 18px;
          padding: 5px 10px;
          border-radius: 5px;
          margin-left: 10px;
          border: 1px solid rgba(255, 107, 107, 0.3);
          transition: all 0.2s;
        }


        .delete-btn:hover {
          background: rgba(255, 71, 87, 0.8);
          color: #fff;
          border-color: #ff4757;
          transform: scale(1.1);
        }


        /* Completed Task Style */
        .completed-text {
          text-decoration: line-through;
          opacity: 0.6;
        }


        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
    </style>
</head>
<body>
    <div id="root"></div>


    <script>
        async function loadComponent() {
            try {
                // Fetch the JSX file
                const response = await fetch('./TodoApp.jsx');
                if (!response.ok) throw new Error('Failed to load TodoApp.jsx');
                let code = await response.text();


                // Simple transformations to make the module code compatible with browser global script
                // 1. Comment out imports (we mostly rely on global React/ReactDOM)
                code = code.replace(/import\s+.*from\s+['"].*['"];?/g, match => `// ${match}`);
               
                // 2. Comment out exports
                code = code.replace(/export\s+default\s+\w+;?/g, match => `// ${match}`);
               
                // 3. Add useState shim since destructuring import was removed
                const preamble = `const { useState } = React; \n`;
               
                // 4. Add mounting logic at the end
                const footer = `
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(<TodoApp />);
                `;


                const finalCode = preamble + code + footer;


                // Transform JSX to JS using Babel Standalone
                const output = Babel.transform(finalCode, { presets: ['react'] }).code;


                // Execute the transformed code
                eval(output);


            } catch (err) {
                console.error(err);
                document.body.innerHTML = `<h3 style="color: red; padding: 20px;">Error loading component: ${err.message}</h3>`;
            }
        }


        loadComponent();
    </script>
</body>
</html>
