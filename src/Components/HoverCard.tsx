import * as React from 'react';
import { HoverCard, IExpandingCardProps, ThemeProvider } from '@fluentui/react';


const classNames = {
  compactCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  expandedCard: {
    padding: '16px 24px',
  },
  item: {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};


interface HoverCardProps {
  item: any;
  renderCompactCard: (item: any) => JSX.Element;
  renderExpandedCard: (item: any) => JSX.Element;
  columnKeyForHoverCard: string;
  children: React.ReactNode; 
}


const HoverCardComponent: React.FC<HoverCardProps> = ({
  item,
  renderCompactCard,
  renderExpandedCard,
  columnKeyForHoverCard,
  children,
}) => {

  const expandingCardProps: IExpandingCardProps = {
    onRenderCompactCard: () => renderCompactCard(item),
    onRenderExpandedCard: () => renderExpandedCard(item),
    renderData: item,
  };


  return (
    <ThemeProvider>
      <HoverCard
        expandingCardProps={expandingCardProps}
        // instantOpenOnClick={true}
        // expandedCardOpenDelay={400}
        // cardDismissDelay={300000000}
      >
        <div >
          {children}
        </div>
      </HoverCard>
    </ThemeProvider>
  );
};

export default HoverCardComponent;
