
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");
    *,
    *:after,
    *:before {
      box-sizing: border-box;
    }
  
    :root {
      --color-text-primary: #1c2a38;
      --color-text-secondary: #8a8f98;
      --color-text-alert: #d72641;
      --color-text-icon: #dbdade;
      --color-bg-primary: #fff;
      --color-bg-secondary: #f3f5f9;
      --color-bg-alert: #fdeaec;
      --color-theme-primary: #623ce6;
    }
  
    button,
    input,
    select,
    textarea {
      font: inherit;
    }
  
    img {
      display: block;
    }
  
    strong {
      font-weight: 600;
    }
  
    body {
      font-family: "Inter", sans-serif;
      line-height: 1.5;
      color: var(--color-text-primary);
      background-color: var(--color-bg-secondary);
    }
  
    .match {
      /* background-color: var(--color-bg-primary); */
      display: flex;
      flex-direction: column;
      min-width: 600px;
      border-radius: 10px;
      /* box-shadow: 0 0 2px 0 rgba(48, 48, 48, 0.1),
        0 4px 4px 0 rgba(48, 48, 48, 0.1); */
    }
  
    .match-border {
    margin-bottom: 24px;
    background-color: var(--color-bg-primary);
    box-shadow: 0 0 2px 0 rgba(48, 48, 48, 0.1), 0 4px 4px 0 rgba(48, 48, 48, 0.1);
    }
    .match-header {
      display: flex;
      padding: 5px 10px;
      border-bottom: 2px solid rgba(48, 48, 48, 0.1);
    }
  
    .match-status {
      background-color: var(--color-bg-alert);
      color: var(--color-text-alert);
      padding: 5px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      line-height: 1;
      margin-right: auto;
    }
    .match-status:before {
      content: "";
      display: block;
      width: 6px;
      height: 6px;
      background-color: currentcolor;
      border-radius: 50%;
      margin-right: 8px;
    }
  
    .match-tournament {
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    .match-tournament img {
      width: 20px;
      margin-right: 12px;
    }
  
    .match-actions {
      display: flex;
      margin-left: auto;
    }
  
    .btn-icon {
      border: none;
      background-color: transparent;
      color: var(--color-text-icon);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .match-content {
      display: flex;
      position: relative;
    }
  
    .column {
    /* padding: 16px; */
    display: flex;
    justify-content: center;
    align-items: baseline;
    width: calc(100% / 3);
    }
  
    .team {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 28px;
    }
  
    .team-logo {
      width: 65px;
      height: 65px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: var(--color-bg-primary);
      box-shadow: 0 4px 4px 0 rgba(48, 48, 48, 0.15),
        0 0 0 15px var(--color-bg-secondary);
    }
    .team-logo img {
      width: 50px;
    }
  
    .team-name {
      text-align: center;
      margin-top: 24px;
      font-size: 18px;
      font-weight: 600;
    }
  
    .match-details {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .match-date,
    .match-referee {
      font-size: 13px;
      color: var(--color-text-secondary);
    }
    .match-date strong,
    .match-referee strong {
      color: var --color-text-primary;
    }
  
    .match-score {
      margin-top: 12px;
      display: flex;
      align-items: center;
    }
  
    .match-score-number {
      font-size: 48px;
      font-weight: 600;
      line-height: 1;
    }
    .match-score-number--leading {
      color: var(--color-theme-primary);
    }
  
    .match-score-divider {
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      color: var --color-text-icon;
      margin-left: 10px;
      margin-right: 10px;
    }
  
    .match-time-lapsed {
      color: #df9443;
      font-size: 14px;
      font-weight: 600;
      margin-top: 8px;
    }
  
    .match-referee {
      margin-top: 12px;
    }
  
    .match-bet-options {
      display: flex;
      margin-top: 3px;
      padding-bottom: 12px;
    }
  
    .match-bet-option {
      margin-left: 4px;
      margin-right: 4px;
      border: 1px solid var(--color-text-icon);
      background-color: #f9f9f9;
      border-radius: 2px;
      color: var(--color-text-secondary);
      font-size: 12px;
      font-weight: 600;
      padding: 2px 6px
    }
  
    .match-bet-place {
      width: 155px;
      position: absolute;
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
      border: none;
      background-color: #3c8ae6;
      border-radius: 6px;
      padding: 2px 40px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      box-shadow: 0 4px 8px 0 rgba(48, 48, 48, 0.25);
    }
  
    .container {
      /* position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0; */
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .score-board {
      display: grid;
      grid-template-columns: auto auto;
      gap: 10px;
  }

  .quarter {
      border: 1px solid #ccc;
      padding: 10px;
      text-align: center;
  }
@media only screen and (max-width: 799px){
    .match {
    min-width: 100%;
}
.match-details {
    text-align: center;
    width: 100%;
}
}
