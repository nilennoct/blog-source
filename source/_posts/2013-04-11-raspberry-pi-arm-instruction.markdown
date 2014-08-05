---
author: nilennoct
comments: true
date: 2013-04-11 02:02:35
layout: post
slug: raspberry-pi-arm-instruction
title: '[RPi] ARM指令'
wordpress_id: 262
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

**生成了Thumb指令还是ARM指令，如何通过编译参数改变**

编写测试代码arm.c。

``` c
#include <stdio.h>

int main() {
	int a = 0;
	a++;
	return 0;
}
```

用如下命令编译，并使用objdump查看。

``` c
gcc -c arm.c
objdump -d arm.o

arm.o:     file format elf32-littlearm

Disassembly of section .text:

00000000 <main>:
   0:	e52db004 	push	{fp}		; (str fp, [sp, #-4]!)
   4:	e28db000 	add	fp, sp, #0
   8:	e24dd00c 	sub	sp, sp, #12
   c:	e3a03000 	mov	r3, #0
  10:	e50b3008 	str	r3, [fp, #-8]
  14:	e51b3008 	ldr	r3, [fp, #-8]
  18:	e2833001 	add	r3, r3, #1
  1c:	e50b3008 	str	r3, [fp, #-8]
  20:	e3a03000 	mov	r3, #0
  24:	e1a00003 	mov	r0, r3
  28:	e28bd000 	add	sp, fp, #0
  2c:	e8bd0800 	pop	{fp}
  30:	e12fff1e 	bx	lr
```

可以看到指令长度都是32位的，说明gcc默认是以arm指令编译的。使用如下命令查找如何以Thumb编译。
<!-- more -->

``` c
gcc --target-help | grep [Tt]humb
-mcallee-super-interworking Thumb: Assume non-static functions may be called
-mcaller-super-interworking Thumb: Assume function pointers may go to non-Thumb aware code
-mthumb                     Compile for the Thumb not the ARM
-mthumb-interwork           Support calls between Thumb and ARM instruction
-mtpcs-frame                Thumb: Generate (non-leaf) stack frames even if
-mtpcs-leaf-frame           Thumb: Generate (leaf) stack frames even if not
-mthumb                 assemble Thumb code
-mthumb-interwork       support ARM/Thumb interworking
--thumb-entry=<sym>         Set the entry point to be Thumb symbol <sym>
--[no-]fix-cortex-a8        Disable/enable Cortex-A8 Thumb-2 branch erratum fix
--thumb-entry=<sym>         Set the entry point to be Thumb symbol <sym>
--[no-]fix-cortex-a8        Disable/enable Cortex-A8 Thumb-2 branch erratum fix
```

可以看到使用“-mthumb”参数可以“Compile for the Thumb not the ARM”。下面来检验一下。

``` c
gcc -c -mthumb -msoft-float arm.c
objdump -d arm.o

arm.o:     file format elf32-littlearm

Disassembly of section .text:

00000000 <main>:
   0:	b580      	push	{r7, lr}
   2:	b082      	sub	sp, #8
   4:	af00      	add	r7, sp, #0
   6:	2300      	movs	r3, #0
   8:	607b      	str	r3, [r7, #4]
   a:	687b      	ldr	r3, [r7, #4]
   c:	3301      	adds	r3, #1
   e:	607b      	str	r3, [r7, #4]
  10:	2300      	movs	r3, #0
  12:	1c18      	adds	r0, r3, #0
  14:	46bd      	mov	sp, r7
  16:	b002      	add	sp, #8
  18:	bd80      	pop	{r7, pc}
  1a:	46c0      	nop			; (mov r8, r8)
```

可以看到指令长度变成了16位，即使用了Thumb指令。


---


**对于ARM指令，能否产生条件执行的指令**

编写测试代码branch.c。

``` c
#include <stdio.h>

int f(int a, int b) {
	int t;
	if (a > b)
		t = a - b--;
	if (a == b - 10)
		t = a + b++;
	return t;
}

int main() {
	f(10, 20);
	return 0;
}
```

使用如下命令编译，并使用objdump查看结果。

``` c
gcc -c branch.c -O3
objdump -d branch.o

branch.o:     file format elf32-littlearm

Disassembly of section .text:

00000000 <f>:
   0:	e1500001 	cmp	r0, r1
   4:	c0613000 	rsbgt	r3, r1, r0
   8:	c2411001 	subgt	r1, r1, #1
   c:	e241200a 	sub	r2, r1, #10
  10:	e1520000 	cmp	r2, r0
  14:	00813000 	addeq	r3, r1, r0
  18:	e1a00003 	mov	r0, r3
  1c:	e12fff1e 	bx	lr

Disassembly of section .text.startup:

00000000 <main>:
   0:	e3a00000 	mov	r0, #0
   4:	e12fff1e 	bx	lr
```

可以看到有rsbgt、subgt、addeq等条件执行指令的出现。


---


**设计C的代码场景，观察是否产生了寄存器移位寻址**

编写测试代码shift.c。

``` c
#include <stdio.h>

int f(int i) {
	int a[20];
	a[19] = a[i*2];
	return a[19];
}

int main() {
	int b = f(5);
	return 0;
}
```

使用如下命令编译，并使用objdump查看结果。

``` c
gcc -c shift.c -O3
objdump -d shift.o

shift.o:     file format elf32-littlearm

Disassembly of section .text:

00000000 <f>:
   0:	e24dd050 	sub	sp, sp, #80	; 0x50
   4:	e28d3050 	add	r3, sp, #80	; 0x50
   8:	e0830180 	add	r0, r3, r0, lsl #3
   c:	e5100050 	ldr	r0, [r0, #-80]	; 0x50
  10:	e28dd050 	add	sp, sp, #80	; 0x50
  14:	e12fff1e 	bx	lr

Disassembly of section .text.startup:

00000000 <main>:
   0:	e3a00000 	mov	r0, #0
   4:	e12fff1e 	bx	lr
```

可以看到在命令“add	r0, r3, r0, lsl #3”中，第2个寄存器操作数先做了左移三位的操作，然后再与第1个操作数相加。


---


**设计C的代码场景,观察一个复杂的32位数是如何装载到寄存器的**

编写测试代码bigint.c。

``` c
#include <stdio.h>

unsigned int f() {
	return 0xFDB86420;
}

int main() {
	unsigned int a;
	a = f();

	return 0;
}
```

使用如下命令编译，并使用objdump查看结果。

``` c
gcc -c bigint.c
objdump -d bigint.o

bigint.o:     file format elf32-littlearm

Disassembly of section .text:

00000000 <f>:
   0:	e52db004 	push	{fp}		; (str fp, [sp, #-4]!)
   4:	e28db000 	add	fp, sp, #0
   8:	e59f300c 	ldr	r3, [pc, #12]	; 1c <f+0x1c>
   c:	e1a00003 	mov	r0, r3
  10:	e28bd000 	add	sp, fp, #0
  14:	e8bd0800 	pop	{fp}
  18:	e12fff1e 	bx	lr
  1c:	fdb86420 	.word	0xfdb86420

00000020 <main>:
  20:	e92d4800 	push	{fp, lr}
  24:	e28db004 	add	fp, sp, #4
  28:	e24dd008 	sub	sp, sp, #8
  2c:	ebfffffe 	bl	0 <f>
  30:	e50b0008 	str	r0, [fp, #-8]
  34:	e3a03000 	mov	r3, #0
  38:	e1a00003 	mov	r0, r3
  3c:	e24bd004 	sub	sp, fp, #4
  40:	e8bd8800 	pop	{fp, pc}
```

可以看到ARM在处理32位数的时候，不是像MIPS那样通过lui、ori指令实现，而是直接将其作为伪指令存在内存中，通过ldr指令读取到寄存器中。


---


**写一个C的多重函数调用的程序，观察和分析**

编写测试代码bigint.c。

``` c
#include <stdio.h>

int a(int x, int y, int z, int l, int m, int n) {
	return l * x + m * y + n * z;
}

int b(int x, int y, int z) {
	int l = 4, m = 2, n = 1;
	x++; y++; z++;

	return a(x, y, z, l, m, n);
}

int main() {
	int a = b(1, 2, 4);

	return 0;
}
```

使用如下命令编译，并使用objdump查看结果。

``` c
gcc -c call.c
objdump -d call.o

call.o:     file format elf32-littlearm

Disassembly of section .text:

00000000 <a>:
   0:	e52db004 	push	{fp}		; (str fp, [sp, #-4]!)
   4:	e28db000 	add	fp, sp, #0
   8:	e24dd014 	sub	sp, sp, #20
   c:	e50b0008 	str	r0, [fp, #-8]
  10:	e50b100c 	str	r1, [fp, #-12]
  14:	e50b2010 	str	r2, [fp, #-16]
  18:	e50b3014 	str	r3, [fp, #-20]
  1c:	e51b3014 	ldr	r3, [fp, #-20]
  20:	e51b2008 	ldr	r2, [fp, #-8]
  24:	e0020392 	mul	r2, r2, r3
  28:	e59b3004 	ldr	r3, [fp, #4]
  2c:	e51b100c 	ldr	r1, [fp, #-12]
  30:	e0030391 	mul	r3, r1, r3
  34:	e0822003 	add	r2, r2, r3
  38:	e59b3008 	ldr	r3, [fp, #8]
  3c:	e51b1010 	ldr	r1, [fp, #-16]
  40:	e0030391 	mul	r3, r1, r3
  44:	e0823003 	add	r3, r2, r3
  48:	e1a00003 	mov	r0, r3
  4c:	e28bd000 	add	sp, fp, #0
  50:	e8bd0800 	pop	{fp}
  54:	e12fff1e 	bx	lr

00000058 <b>:
  58:	e92d4800 	push	{fp, lr}
  5c:	e28db004 	add	fp, sp, #4
  60:	e24dd028 	sub	sp, sp, #40	; 0x28
  64:	e50b0018 	str	r0, [fp, #-24]
  68:	e50b101c 	str	r1, [fp, #-28]
  6c:	e50b2020 	str	r2, [fp, #-32]
  70:	e3a03004 	mov	r3, #4
  74:	e50b3008 	str	r3, [fp, #-8]
  78:	e3a03002 	mov	r3, #2
  7c:	e50b300c 	str	r3, [fp, #-12]
  80:	e3a03001 	mov	r3, #1
  84:	e50b3010 	str	r3, [fp, #-16]
  88:	e51b3018 	ldr	r3, [fp, #-24]
  8c:	e2833001 	add	r3, r3, #1
  90:	e50b3018 	str	r3, [fp, #-24]
  94:	e51b301c 	ldr	r3, [fp, #-28]
  98:	e2833001 	add	r3, r3, #1
  9c:	e50b301c 	str	r3, [fp, #-28]
  a0:	e51b3020 	ldr	r3, [fp, #-32]
  a4:	e2833001 	add	r3, r3, #1
  a8:	e50b3020 	str	r3, [fp, #-32]
  ac:	e51b300c 	ldr	r3, [fp, #-12]
  b0:	e58d3000 	str	r3, [sp]
  b4:	e51b3010 	ldr	r3, [fp, #-16]
  b8:	e58d3004 	str	r3, [sp, #4]
  bc:	e51b0018 	ldr	r0, [fp, #-24]
  c0:	e51b101c 	ldr	r1, [fp, #-28]
  c4:	e51b2020 	ldr	r2, [fp, #-32]
  c8:	e51b3008 	ldr	r3, [fp, #-8]
  cc:	ebfffffe 	bl	0 <a>
  d0:	e1a03000 	mov	r3, r0
  d4:	e1a00003 	mov	r0, r3
  d8:	e24bd004 	sub	sp, fp, #4
  dc:	e8bd8800 	pop	{fp, pc}

000000e0 <main>:
  e0:	e92d4800 	push	{fp, lr}
  e4:	e28db004 	add	fp, sp, #4
  e8:	e24dd008 	sub	sp, sp, #8
  ec:	e3a00001 	mov	r0, #1
  f0:	e3a01002 	mov	r1, #2
  f4:	e3a02004 	mov	r2, #4
  f8:	ebfffffe 	bl	58 <b>
  fc:	e50b0008 	str	r0, [fp, #-8]
 100:	e3a03000 	mov	r3, #0
 104:	e1a00003 	mov	r0, r3
 108:	e24bd004 	sub	sp, fp, #4
 10c:	e8bd8800 	pop	{fp, pc}
```

分析得到的汇编代码可以得知：

- 调用时的返回地址在lr中；
- 传入的参数保存在r0—r3中，若有更多的参数则多出的参数存在内存中；
- 本地变量的堆栈分配在高地址，传递进来的参数分配在低地址；
- 寄存器是callee保存的，部分保存。


---


**MLA是带累加的乘法，尝试要如何写C的表达式能编译得到MLA指令**

编写测试代码mla.c。

``` c
#include <stdio.h>

int f(int a, int b, int c) {
	return a * b + c;
}

int main() {
	int t;
	t = f(1, 2, 3);
	return 0;
}
```

用如下命令编译，并使用objdump查看。

``` c
gcc -c mla.c -O3
objdump -d mla.o

mla.o:     file format elf32-littlearm

Disassembly of section .text:

00000000 <f>:
   0:	e0202091 	mla	r0, r1, r0, r2
   4:	e12fff1e 	bx	lr

Disassembly of section .text.startup:

00000000 <main>:
   0:	e3a00000 	mov	r0, #0
   4:	e12fff1e 	bx	lr
```

可以看到在f()函数中的运算使用了mla指令。
