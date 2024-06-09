import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { checkToolSelected, textEditorTools } from '../TextEditor.service';
import classes from '../TextEditor.module.css';

export const TextEditorFormatterBtn = ({ btnStatus, setBtnStatus }) => {
  const containerArea = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const openToolbar = () => setOpen(!isOpen);

  const checkSelect = useCallback(
    (e) => {
      if (!isOpen || !containerArea.current) return;
      if (!containerArea.current.contains(e.target)) {
        setOpen(false);
      }
    },
    [isOpen, setOpen, containerArea]
  );

  //Control closing Select results
  useEffect(() => {
    window.addEventListener('click', checkSelect);
    return () => {
      window.removeEventListener('click', checkSelect);
    };
  }, [checkSelect]);

  return (
    <div ref={containerArea} className={classes.textEditorToolbarBox}>
      <div
        className={`${classes.textEditorToolbar} ${
          isOpen && classes.textEditorToolbarActive
        }`}
      >
        {textEditorTools.map((t) => (
          <Fragment key={t.name}>
            <button
              className={`${classes.textEditorBtn} ${
                t.className && classes[t.className]
              } ${btnStatus[t.name] && classes.textEditorBtnActive}`}
              onClick={() => {
                document.execCommand(t.command);
                if (t.type === 'justify') {
                  const data = { [t.name]: !btnStatus[t.name] };
                  textEditorTools.forEach((tool) => {
                    if (tool.name !== t.name && tool.type === 'justify') {
                      data[tool.name] = false;
                    }
                  });
                  setBtnStatus({ ...btnStatus, ...data });
                } else {
                  setBtnStatus({ ...btnStatus, [t.name]: !btnStatus[t.name] });
                }
              }}
            >
              {t.icon}
            </button>
            {t.isDevider && <div className={classes.textEditorDevider}></div>}
          </Fragment>
        ))}
      </div>
      <button
        className={`${classes.textEditorMenuBtn} ${
          classes.textEditorUnderlined
        } ${
          checkToolSelected(btnStatus) ? classes.textEditorMenuBtnSelected : ''
        } ${isOpen ? classes.textEditorMenuBtnActive : ''}`}
        onClick={openToolbar}
      >
        A
      </button>
    </div>
  );
};
