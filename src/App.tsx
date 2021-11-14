import {ReactComponent as ResumeIcon} from './resources/resume_icon.svg'
import {animated, useSpring} from 'react-spring'
import './App.css';
import useBoop from './boop';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import resume from './resources/resume_liam_vrchat.pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useDrag, useHover } from '@use-gesture/react'

function App() {

  //@ts-ignore
  const sendMessageToUnity = () => window.vuplex.postMessage({ type: 'command', message: 'logout' });

  const [{ x, y}, dragApi] = useSpring(() => ({ x: 0, y: 0}))
  const [{opacity, scale}, clickApi] = useSpring(() => ({opacity: 0, scale: 0.01}))
  const [{backgroundColor}, hoverLogOutApi] = useSpring(() => ({backgroundColor: 'rgb(117, 145, 145, 0)'}))

  const bindHover = useHover(({ hovering }) => hoverLogOutApi.start({backgroundColor: hovering ? 'rgb(117, 145, 145, 1)' : 'rgb(117, 145, 145, 0)'}))

  const bind = useDrag(({ offset: [mx, my] }) => {
    dragApi.start({x: mx, y: my})
  })

  const handleContainerClick = () => {
    setContainerClicked(!containerClicked)
    clickApi.start({opacity: containerClicked ? 0 : 1, scale: containerClicked ? 0.01 : 1})
  }

  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
      setHeight(window.innerHeight);
  }

  useEffect(() => {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const [containerHovered, setContainerHovered] = useState(false)
  const [containerClicked, setContainerClicked] = useState(false)

  const [style, trigger] = useBoop({ y: 2 });

  const containerProps = useSpring({backgroundColor: containerClicked ? 'rgb(121, 182, 220, 1)' : (containerHovered ? 'rgb(121, 182, 220, 0.5)' : 'rgb(121, 182, 220, 0)')})

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  //@ts-ignore
  const openLinkInNewTab = (e) => {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === 'a') {
        window.open( e.target.href );
    }
  }

  return (
    <div className="app">
      <animated.div style={containerProps} onClick={() => handleContainerClick()} onMouseEnter={() => setContainerHovered(true)} onMouseLeave={() => setContainerHovered(false)} className="resume-icon-container" >
        {/*
        // @ts-ignore */}
        <animated.div onMouseEnter={trigger} style={style} className="resume-icon-container">
          <ResumeIcon style={{height: "20vh"}} />
        </animated.div>
        <span>resume</span>
      </animated.div>
      <animated.div className="draggable" {...bind()} style={{ x, y, opacity, scale }}>
        <div onClick={(event) => openLinkInNewTab(event)}>
          <Document file={resume}>
            <Page className="resume" pageNumber={1} />
          </Document>
        </div>
      </animated.div>
      <animated.div {...bindHover()} onClick={() => sendMessageToUnity()} 
        style={{position: "absolute", bottom: "30px", right: "30px", borderRadius: "5px", border: "2px solid #759191", padding: "1rem", backgroundColor}}>
          Log Out
      </animated.div>
    </div>
  );
}

export default App;
