/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class', 'class'],
	  content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	 
		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	  ],
	  theme: {
      	extend: {
      		keyframes: {
      			'bounce-fast': {
      				'0%, 100%': {
      					transform: 'scale(1)'
      				},
      				'50%': {
      					transform: 'scale(1.15)'
      				}
      			}
      		},
      		animation: {
      			'bounce-fast': 'bounce-fast 0.3s ease-in-out'
      		},
      		borderRadius: {
      			lg: 'var(--radius)',
      			md: 'calc(var(--radius) - 2px)',
      			sm: 'calc(var(--radius) - 4px)'
      		},
      		colors: {
				brand: {
        		primary: '#1E3A8A',
        		accent: '#F59E0B',
        		secondary: '#7C2D12',
        		light: '#F9FAFB',
        		dark: '#1F2937',
      			},
      			background: 'hsl(var(--background))',
      			foreground: 'hsl(var(--foreground))',
      			card: {
      				DEFAULT: 'hsl(var(--card))',
      				foreground: 'hsl(var(--card-foreground))'
      			},
      			popover: {
      				DEFAULT: 'hsl(var(--popover))',
      				foreground: 'hsl(var(--popover-foreground))'
      			},
      			primary: {
      				DEFAULT: 'hsl(var(--primary))',
      				foreground: 'hsl(var(--primary-foreground))'
      			},
      			secondary: {
      				DEFAULT: 'hsl(var(--secondary))',
      				foreground: 'hsl(var(--secondary-foreground))'
      			},
      			muted: {
      				DEFAULT: 'hsl(var(--muted))',
      				foreground: 'hsl(var(--muted-foreground))'
      			},
      			accent: {
      				DEFAULT: 'hsl(var(--accent))',
      				foreground: 'hsl(var(--accent-foreground))'
      			},
      			destructive: {
      				DEFAULT: 'hsl(var(--destructive))',
      				foreground: 'hsl(var(--destructive-foreground))'
      			},
      			border: 'hsl(var(--border))',
      			input: 'hsl(var(--input))',
      			ring: 'hsl(var(--ring))',
      			chart: {
      				'1': 'hsl(var(--chart-1))',
      				'2': 'hsl(var(--chart-2))',
      				'3': 'hsl(var(--chart-3))',
      				'4': 'hsl(var(--chart-4))',
      				'5': 'hsl(var(--chart-5))'
      			}
      		}
      	}
      },
	  plugins: [require("tailwindcss-animate")],
	}