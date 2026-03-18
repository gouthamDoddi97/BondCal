# BondCal — Bond Yield Calculator

A cross-platform mobile and web app built with **React Native + Expo** that calculates bond yields and generates a full cash flow schedule from basic bond parameters.

---

## Features

- **Current Yield** — Quick snapshot of annual coupon income relative to market price
- **Yield to Maturity (YTM)** — True annualised return solved via Newton-Raphson iteration
- **Premium / Discount / Par** — Visual pricing status with market vs face value difference
- **Cash Flow Schedule** — Full period-by-period table with coupon payments, cumulative interest, and remaining principal
- **Annual & Semi-Annual** coupon frequency support
- Responsive table that adapts to screen width and orientation (portrait + landscape)
- Collapsible cash flow table
- Runs on **Android**, **iOS**, and **Web**

---

https://github.com/user-attachments/assets/27d7b478-0639-43e3-8c66-4193945ed023



## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 54 |
| Language | TypeScript |
| UI | React Native (core components) |
| Web support | react-native-web |
| Math | Custom Newton-Raphson YTM solver |

---

## Project Structure

```
bondCal/
├── App.tsx                        # Root component — inputs, state, layout
├── index.ts                       # Entry point
├── app.json                       # Expo config (orientation, icons, etc.)
├── src/
│   ├── components/
│   │   ├── InputField.tsx         # Labelled numeric input with prefix/suffix
│   │   ├── ResultCard.tsx         # Single result tile (yield, price status, etc.)
│   │   └── CashFlowTable.tsx      # Collapsible, responsive cash flow table
│   ├── hooks/
│   │   └── useScreenWidth.ts      # Reactive screen width hook (orientation-aware)
│   └── utils/
│       └── bondCalculations.ts    # All bond math (YTM solver, cash flows, formatters)
└── assets/                        # Icons, splash screen, favicon
```

---

## Bond Inputs

| Field | Description |
|---|---|
| **Face Value** | The principal amount printed on the bond (e.g. $1,000) |
| **Coupon Rate** | Annual interest rate as a percentage of face value (e.g. 5%) |
| **Market Price** | Current price to buy the bond in the market |
| **Years to Maturity** | Remaining life of the bond in years |
| **Coupon Frequency** | Annual (×1/year) or Semi-Annual (×2/year) |

---

## How YTM is Calculated

YTM is the discount rate `y` that satisfies:

$$\text{Market Price} = \sum_{t=1}^{n} \frac{C}{(1+y)^t} + \frac{FV}{(1+y)^n}$$

Since this has no closed-form solution, the app uses **Newton-Raphson iteration** with an approximation formula as the initial guess, converging in under 500 iterations to a precision of `1e-7`.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go app on your phone (for mobile testing)

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` to open in browser
- Scan the QR code with Expo Go on your phone

---

## License

See [LICENSE](LICENSE) for details.
