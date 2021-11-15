import {animated, useSpring} from 'react-spring'
import { useState } from 'react';
import useBoop from '../../boop';
import './DesktopItem.css';

type DesktopIconProps = {
  name: string,
  children: React.ReactNode,
  onClick: Function,
  clicked: boolean
}

function DesktopIcon(props: DesktopIconProps) {
  const [containerHovered, setContainerHovered] = useState(false)

  const [style, trigger] = useBoop({ y: 2 });

  const containerProps = useSpring({backgroundColor: props.clicked ? 'rgb(121, 182, 220, 1)' : (containerHovered ? 'rgb(121, 182, 220, 0.5)' : 'rgb(121, 182, 220, 0)')})

  return (
      <animated.div style={containerProps} onClick={() => props.onClick()} onMouseEnter={() => setContainerHovered(true)} onMouseLeave={() => setContainerHovered(false)} className="icon-container" >
        {/*
        // @ts-ignore */}
        <animated.div onMouseEnter={trigger} style={style} className="icon-container">
          <div style={{height: "20vh", minWidth: "7vw"}}>
            {props.children}
          </div>
        </animated.div>
        <span>{props.name}</span>
      </animated.div>
  );
}

export default DesktopIcon;
