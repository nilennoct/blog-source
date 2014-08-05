---
layout: post
title: "在IntelliJ Idea中使用SWT"
slug: "use-swt-in-intellij-idea"
date: 2013-07-16 14:22
comments: true
categories: 
- Note
---
首先下载[SWT](http://www.eclipse.org/swt/),得到一个ZIP包，解压到IntelliJ Idea的Workspace目录。

打开IntelliJ Idea，选择`File`->`Other Settings`->`Default Project Structure`，在`Global Libraries`中点击加号，选择刚才解压出来的SWT的路径，设置好名字后点`OK`保存。如下图所示。

![Default Project Structure](http://img.nilennoct.com/wp-content/uploads/2013/07/Default-Project-Structure.png)
<!-- more -->
新建一个工程，选择`File`->`Project Structure`，在`Modules`选项卡的`Dependencies`中点击加号添加`Library`，选择`Global Libraries`中刚刚添加的`org.eclipse.swt`。

![Project Structure](http://img.nilennoct.com/wp-content/uploads/2013/07/Project-Structure.png)

现在来新建一个Java文件看看效果吧：

``` java SwtTest.java
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.PaintEvent;
import org.eclipse.swt.events.PaintListener;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.widgets.Canvas;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;

public class SwtTest {
	static public void main(String args[]) {
		Display display = new Display();
		final Shell shell = new Shell(display);

		Canvas canvas = new Canvas(shell, SWT.NONE);
		canvas.setSize(400, 300);
		canvas.addPaintListener(new PaintListener() {
			@Override
			public void paintControl(PaintEvent e) {
				Rectangle clientArea = shell.getClientArea();
				e.gc.drawLine(0, 0, clientArea.width, clientArea.height);
				e.gc.drawLine(clientArea.width, 0, 0, clientArea.height);
			}
		});

		shell.setText("SwtTest");
		shell.pack();
		shell.open();

		while ( ! shell.isDisposed()) {
			if ( ! display.readAndDispatch()) {
				display.sleep();
			}
		}
		display.dispose();
	}
}
```

运行结果如下图：

![SwtTest](http://img.nilennoct.com/wp-content/uploads/2013/07/SwtTest.png)

以后需要在工程中使用SWT时，只要做第三步就可以了，也还是挺方便的。