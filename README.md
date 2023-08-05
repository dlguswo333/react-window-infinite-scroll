# react-window-infinite-scroll
This repository is a monorepo for react-window-infinite-scroll.

## Repository Structure
```text
monorepo
├── package
└── preview
```

### package
This is where the main project lives. In other words, npm publish happens here.

### preview
This is where the preview repository is located. If you build this project and serve the outputs, you can preview the component.

With npm workspace feature, the main package project links to preview automatically.
