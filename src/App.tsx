import {ReactComponent as ResumeIcon} from './resources/resume_icon.svg'
import {ReactComponent as HotDogIcon} from './resources/hotdog_icon.svg'
import {animated, useSpring} from 'react-spring'
import './App.css';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import resume from './resources/resume_liam_vrchat.pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useDrag, useHover } from '@use-gesture/react'
import DesktopItem from './components/desktop-item/DesktopItem';

function App() {

  const [clicked, setClicked] = useState("")

  const [{ x, y}, dragApi] = useSpring(() => ({ x: 0, y: 0}))
  const [{opacity, scale}, clickApi] = useSpring(() => ({opacity: 0, scale: 0.01}))
  const [{backgroundColor}, hoverLogOutApi] = useSpring(() => ({backgroundColor: 'rgb(117, 145, 145, 0)'}))

  const bindHover = useHover(({ hovering }) => hoverLogOutApi.start({backgroundColor: hovering ? 'rgb(117, 145, 145, 1)' : 'rgb(117, 145, 145, 0)'}))
  const bindDrag = useDrag(({ offset: [mx, my] }) => {
    dragApi.start({x: mx, y: my})
  })

  const handleClick = (item : string) => {
    if (clicked == item) {
      setClicked("")
      clickApi.start({opacity: 0, scale: 0.01})
    } else {
      setClicked(item)
      clickApi.start({opacity: 1, scale: 1})
    }
  }

  // @ts-ignore
  const sendMessageToUnity = () => window.parent.postMessage({ type: 'vuplex.postMessage', message: 'logout' }, '*');

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
      <DesktopItem onClick={() => handleClick("resume")} name="resume" clicked={(clicked == "resume")}>
          <ResumeIcon />
      </DesktopItem>
      <DesktopItem onClick={() => handleClick("hotdog")} name="not_taco.png" clicked={(clicked == "hotdog")}>
          <HotDogIcon />
      </DesktopItem>
      <animated.div className="draggable" {...bindDrag()} style={{ x, y, opacity, scale }}>
        <div onClick={(event) => openLinkInNewTab(event)}>
          {(clicked == "resume") ?
            <Document file={resume}>
              <Page className="resume" pageNumber={1} />
            </Document>
          : 
          <div style={{height: "50vh", minWidth: "20vw"}}>
            <HotDogIcon />
          </div>
          }
        </div>
      </animated.div>
      <animated.div {...bindHover()} onClick={() => sendMessageToUnity()} 
        style={{position: "absolute", bottom: "5vh", right: "5vw", borderRadius: "5px", border: "2px solid #759191", padding: "1rem", backgroundColor}}>
          Log Out
      </animated.div>
    </div>
  );
}

export default App;
