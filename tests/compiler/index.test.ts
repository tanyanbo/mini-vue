import { describe, expect, it } from "vitest"
import { MyNode } from "../../src/common/my-node"
import { compileHtml } from "../../src/compiler"

describe("html compiler", () => {
  it("compilation result should be of type MyNode", () => {
    const html = "<div></div>"
    const res = compileHtml(html)
    expect(res instanceof MyNode).toBe(true)
  })

  it("compilation result should have a tagName of root", () => {
    const html = "<div></div>"
    const res = compileHtml(html)
    expect(res.tagName).toEqual("root")
  })

  it("one root element should compile to one object", () => {
    const html = "<div></div>"
    const res = compileHtml(html)
    expect(res.children).toHaveLength(1)
  })

  it("three root elements should compile to three objects in the result array", () => {
    const html = "<div></div><p></p><h1></h1>"
    const res = compileHtml(html)
    expect(res.children).toHaveLength(3)
  })

  it("three root elements (some with children) should compile to three objects in the result array", () => {
    const html = "<div></div><p><span>test</span></p><h1></h1>"
    const res = compileHtml(html)
    expect(res.children).toHaveLength(3)
  })

  it("one element should compile to one object of type MyNode", () => {
    const html = "<div></div>"
    const res = compileHtml(html)
    expect(res.children[0] instanceof MyNode).toBe(true)
  })

  it("should compile one element with no children and attributes correctly", () => {
    const html = "<div></div>"
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("div")])
  })

  it("should compile one element with text as children correctly", () => {
    const html = "<p>testing</p>"
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("p", ["testing"])])
  })

  it("should compile multiline html correctly", () => {
    const html = `
      <div>
        testing
      </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("div", ["testing"])])
  })

  it("should compile one element with both text and element children correctly", () => {
    const html = `
    <p>
      aaa
      <span>testing</span>
    </p>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("p", ["aaa", new MyNode("span", ["testing"])]),
    ])
  })

  it("should compile nested elements correctly", () => {
    const html = `
      <div>
        testing
        <p>
          <span>bbb</span>
        </p>
      </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("div", [
        "testing",
        new MyNode("p", [new MyNode("span", ["bbb"])]),
      ]),
    ])
  })

  it("should compile non-boolean props correctly", () => {
    const html = "<p id='para'></p>"
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("p", [], { id: "para" })])
  })

  it("should compile boolean props correctly", () => {
    const html = "<button disabled>aaa</button>"
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("button", ["aaa"], { disabled: "true" }),
    ])
  })

  it("should compile boolean props and non-boolean props correctly (non-boolean prop first)", () => {
    const html = "<button class='btn' disabled>aaa</button>"
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("button", ["aaa"], { disabled: "true", class: "btn" }),
    ])
  })

  it("should compile boolean props and non-boolean props correctly (boolean prop first)", () => {
    const html = "<button disabled class='btn'>aaa</button>"
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("button", ["aaa"], { disabled: "true", class: "btn" }),
    ])
  })

  it("should add comment node when there is a comment", () => {
    const html = `
      <div>
        <!--<p>aaa</p>-->
      </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("div", [new MyNode("comment", ["<p>aaa</p>"])]),
    ])
  })

  it("should add comment node when there is a comment after some text", () => {
    const html = `
      <div>
        bbb
        <!--<p>aaa</p>-->
      </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("div", ["bbb", new MyNode("comment", ["<p>aaa</p>"])]),
    ])
  })

  it("should compile self-closing tag without attributes correctly", () => {
    const html = "<img/>"
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("img")])
  })

  it("should compile self-closing tag without attributes correctly (space right before />)", () => {
    const html = "<img />"
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("img")])
  })

  it("should compile self-closing tag with attributes correctly", () => {
    const html = "<img src='http://www.google.com'/>"
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("img", [], { src: "http://www.google.com" }),
    ])
  })

  it("should compile self-closing tag with attributes correctly (space right before />)", () => {
    const html = "<img src='http://www.google.com' />"
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("img", [], { src: "http://www.google.com" }),
    ])
  })

  it("should compile nested self-closing tag without attributes correctly (without space before />)", () => {
    const html = `
    <div>
      <img/>
    </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("div", [new MyNode("img")])])
  })

  it("should compile nested self-closing tag with attributes correctly (without space before />)", () => {
    const html = `
    <div>
      <img src='http://www.google.com'/>
    </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("div", [
        new MyNode("img", [], { src: "http://www.google.com" }),
      ]),
    ])
  })

  it("should compile nested self-closing tag without attributes correctly (with space before />)", () => {
    const html = `
    <div>
      <img />
    </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("div", [new MyNode("img")])])
  })

  it("should compile nested self-closing tag with attributes correctly (with space before />)", () => {
    const html = `
    <div>
      <img src='http://www.google.com' />
    </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("div", [
        new MyNode("img", [], { src: "http://www.google.com" }),
      ]),
    ])
  })

  it("should compile void tag correctly", () => {
    const html = "<br>"
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("br")])
  })

  it("should compile nested void tag correctly", () => {
    const html = `
      <div>
        <br>
      </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("div", [new MyNode("br")])])
  })

  it("should compile void tag with attributes correctly", () => {
    const html = "<img src='http://www.google.com'>"
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("img", [], { src: "http://www.google.com" }),
    ])
  })

  it("should compile nested void tag with attributes correctly", () => {
    const html = `
      <div>
        <img src='http://www.google.com'>
      </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([
      new MyNode("div", [
        new MyNode("img", [], { src: "http://www.google.com" }),
      ]),
    ])
  })

  it("should compile void tag with closing tag correctly", () => {
    const html = "<br></br>"
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("br")])
  })

  it("should compile nested void tag with closing tag correctly", () => {
    const html = `
      <div>
        <br></br>
      </div>
    `
    const res = compileHtml(html)
    expect(res.children).toEqual([new MyNode("div", [new MyNode("br")])])
  })

  it("should throw when closing tag does not match opening tag", () => {
    const html = `
      <div>
        aaa
      </dic>
    `
    expect(() => {
      compileHtml(html)
    }).toThrow("Closing tag does not match opening tag")
  })
})
