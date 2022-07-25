// Copyright (c) Chung Chan
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

// Codemirror
import {EditorView, basicSetup} from "codemirror"
// import {EditorView} from "codemirror"
// import {editorSetup} from "./editorsetup"

// import {keymap} from "@codemirror/view"
// import {defaultKeymap} from "@codemirror/commands"
import {javascript} from "@codemirror/lang-javascript"
import {html} from "@codemirror/lang-html"

export class DIVEWidgetModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'DIVEWidgetModel',
      _view_name: 'DIVEWidgetView',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,
      code: '// some code here',
      html: '<!-- some code here -->',
      height: 600,
      width: 600
    }
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };
}

export class DIVEWidgetView extends DOMWidgetView {
  private widgetContainer: HTMLDivElement;
  private tabContainer: HTMLDivElement;
  private codeTab: HTMLDivElement;
  private htmlTab: HTMLDivElement;
  private editorContainer: HTMLDivElement;
  private codeContainer: HTMLDivElement;
  private htmlContainer: HTMLDivElement;
  private outputContainer: HTMLIFrameElement;
  private outputDocument: Document;
  private codeScript: HTMLScriptElement;
  private controlContainer: HTMLDivElement;
  private showBtn: HTMLButtonElement;
  private runBtn: HTMLButtonElement;
  // private mathjaxURL: string;
  private codeView: EditorView;
  private htmlView: EditorView;

  render() {
    this.codeTab = document.createElement('div');
    this.htmlTab = document.createElement('div');
    this.codeTab.innerHTML = "Code";
    this.htmlTab.innerHTML = "HTML";
    this.codeTab.classList.add("active-tab");
    this.tabContainer = document.createElement('div');
    this.tabContainer.className = "tab-container";
    this.codeTab.onclick = (() => {
      this.htmlTab.classList.remove("active-tab");
      this.codeTab.classList.add("active-tab");
      this.htmlContainer.style.display = "none";
      this.codeContainer.style.display = "block";
    }).bind(this);
    this.htmlTab.onclick = (() => {
      this.htmlTab.classList.add("active-tab");
      this.codeTab.classList.remove("active-tab");
      this.htmlContainer.style.display = "block";
      this.codeContainer.style.display = "none";
    }).bind(this);
    this.tabContainer.appendChild(this.codeTab);
    this.tabContainer.appendChild(this.htmlTab);    

    this.codeContainer = document.createElement('div');
    this.codeContainer.className = "code-container";
    this.codeContainer.style.display = 'block';
    this.codeContainer.style.overflowX = 'auto';
    this.codeView = new EditorView({
      extensions: [basicSetup,
      // keymap.of([{
      //   key: "Ctrl-Enter", run: (() => {
      //     this.runCode()
      //     return true;
      //   }).bind(this)
      // }]),
      // keymap.of(defaultKeymap),
      javascript()],
      parent: this.codeContainer
    });
    this.codeView.dispatch({changes: {from: 0, insert: this.model.get('code')}});

    this.htmlContainer = document.createElement('div');
    this.htmlContainer.className = "html-container";
    this.htmlContainer.style.display = 'none';
    this.htmlContainer.style.overflowX = 'auto';
    this.htmlView = new EditorView({
      extensions: [basicSetup,
      html()],
      parent: this.htmlContainer
    });
    this.htmlView.dispatch({changes: {from: 0, insert: this.model.get('html')}});

    this.editorContainer = document.createElement('div');
    this.editorContainer.style.display = 'none';
    this.editorContainer.className = 'editor-container';
    this.editorContainer.appendChild(this.codeContainer);
    this.editorContainer.appendChild(this.htmlContainer);
    

    this.controlContainer = document.createElement('div');
    this.controlContainer.className = 'control-container';
    this.controlContainer.style.display = 'flex';
    this.showBtn = document.createElement('button');
    this.showBtn.innerText = 'show code';
    this.showBtn.onclick = this.toggleCode.bind(this);
    this.runBtn = document.createElement('button');
    this.runBtn.innerText = 'run code';
    // this.runBtn.onclick = this.runCode.bind(this);
    this.runBtn.onclick = this.run.bind(this);
    this.runBtn.style.display = 'none';

    this.controlContainer.appendChild(this.showBtn);
    this.controlContainer.appendChild(this.runBtn);

    this.outputContainer = document.createElement('iframe');
    this.outputContainer.className = "output-container";
    this.outputContainer.width = this.model.get('width');
    this.outputContainer.height = this.model.get('height');

    this.setHtml();

    this.widgetContainer = document.createElement('div');
    this.widgetContainer.className = "divewidget";
    this.widgetContainer.appendChild(this.outputContainer);
    this.widgetContainer.appendChild(this.controlContainer);
    this.widgetContainer.appendChild(this.tabContainer);
    this.widgetContainer.appendChild(this.editorContainer);
    this.el.appendChild(this.widgetContainer);
    


    // this.outputContainer.onload = (function (this: DIVEWidgetView) {
    //   this.outputDocument = this.outputContainer.contentDocument!;
    //   this.codeScript = this.outputDocument!.createElement('script');
    //   this.outputDocument.body.appendChild(this.codeScript);
    //   this.setCode();
    //   this.model.on('change:code', this.setCode, this);
    //   this.model.on('change:code', this.setHtml, this);
    // }).bind(this);
  }

  private run() {
    const html = this.htmlView.state.doc.toString();
    const code = this.codeView.state.doc.toString();
    this.model.set('html', html);
    this.model.set('code', code);
    this.model.save_changes();
  }

  /*
  Update the html in the output container with the model html.
  */
  private setHtml() {
    this.outputContainer.srcdoc = this.model.get('html');

    this.outputContainer.onload = (function (this: DIVEWidgetView) {
      this.outputDocument = this.outputContainer.contentDocument!;
      this.codeScript = this.outputDocument!.createElement('script');
      this.outputDocument.body.appendChild(this.codeScript);
      this.setCode();
      this.model.on('change:code', this.setCode, this);
      this.model.on('change:html', this.setHtml, this);
    }).bind(this);
  }

  /*
  Update the script element in the output container with the model code.
  */
  private setCode() {
    let script = this.outputDocument.createElement('script');
    script.innerHTML = this.model.get('code');
    this.outputDocument.body.replaceChild(script, this.codeScript);
    this.codeScript = script;
  }

  private toggleCode() {
    if (this.editorContainer.style.display == 'block') {
      this.showBtn.innerText = 'show code';
      this.tabContainer.style.display = 'none';
      this.editorContainer.style.display = 'none';
      this.runBtn.style.display = 'none';
    } else {
      this.showBtn.innerText = 'hide code';
      this.tabContainer.style.display = 'flex';
      this.editorContainer.style.display = 'block';
      this.runBtn.style.display = 'block';
    }
  }

}