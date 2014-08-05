---
layout: page
title: "[Source]用于Raspberry Pi的简易bootloader"
slug: "raspberrypi-diy-bootloader-source"
date: 2013-05-17 17:14
comments: true
sharing: true
footer: true
---

> 设计思路请参看 [用于Raspberry Pi的简易bootloader](http://www.nilennoct.com/raspberrypi-diy-bootloader/)

``` c bootloader05.c https://gist.github.com/nilennoct/5597400

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------

// The raspberry pi firmware at the time this was written defaults
// loading at address 0x8000.  Although this bootloader could easily
// load at 0x0000, it loads at 0x8000 so that the same binaries built
// for the SD card work with this bootloader.  Change the ARMBASE
// below to use a different location.

#define ARMBASE 0x8000

#define LOAD    0x00
#define GO      0x01
#define PEEK    0x02
#define POKE    0x03
#define VERIFY  0x04

extern void PUT32 ( unsigned int, unsigned int );
extern void PUT16 ( unsigned int, unsigned int );
extern void PUT8 ( unsigned int, unsigned int );
extern unsigned int GET32 ( unsigned int );
extern unsigned int GET8 ( unsigned int );
extern unsigned int GETPC ( void );
extern void BRANCHTO ( unsigned int );
extern void dummy ( unsigned int );

extern void uart_init ( void );
extern unsigned int uart_lcr ( void );
extern void uart_flush ( void );
extern void uart_send ( unsigned int );
extern unsigned int uart_recv ( void );
extern void hexstring ( unsigned int );
extern void hexstrings ( unsigned int );
extern void timer_init ( void );
extern unsigned int timer_tick ( void );

extern void timer_init ( void );
extern unsigned int timer_tick ( void );

void puts(char* s);

//------------------------------------------------------------------------
unsigned char xstring[256];
//------------------------------------------------------------------------
int notmain ( void ) {
    unsigned int ra;
    //unsigned int rb;
    unsigned int rx;
    unsigned int addr;
    unsigned int block;
    unsigned int state;

    unsigned int crc;

    unsigned int error_addr;

    uart_init();
    hexstring(0x12345678);
    hexstring(GETPC());
    hexstring(ARMBASE);
    puts("Hello World!");
    uart_send(0x04);
    timer_init();

//SOH 0x01
//ACK 0x06
//NAK 0x15
//EOT 0x04

//block numbers start with 1

//132 byte packet
//starts with SOH
//block number byte
//255-block number
//128 bytes of data
//checksum byte (whole packet)
//a single EOT instead of SOH when done, send an ACK on it too
    addr=ARMBASE;
    error_addr = 0;
    block=1;
    state=0;
    crc=0;
    rx=timer_tick();

    while(1) {
        ra=timer_tick();
        if((ra-rx)>=4000000) {
            uart_send(0x15);
            rx+=4000000;
        }

        if((uart_lcr()&0x01)==0) continue;

        xstring[state]=uart_recv();
        rx=timer_tick();

        switch(state) {
            case 0: {
                if(xstring[state]==0x01) {
                    crc=xstring[state];
                    state++;
                }
                else if (xstring[state] == 0x04) {
                    uart_send(0x06);
                    if (xstring[1] == LOAD) {
                        puts("LOADED");
                        uart_send(0x04);
                        uart_flush();
                    }
                    else if (xstring[1] == VERIFY) {
                        if (error_addr == 0) {
                            puts("VERIFY SUCCESS");
                            uart_send(0x04);
                        }
                        else {
                            puts("VERIFY ERROR");
                            puts("MEM ADDRESS:");
                            hexstring(error_addr);
                            puts("MEM VALUE:");
                            hexstring(GET32(error_addr));
                            uart_send(0x04);
                        }
                        uart_flush();
                    }
                    addr = ARMBASE;
                    error_addr = 0;
                    block = 1;
                    state = 0;
                    crc = 0;
                }
                else {
                    state=0;
                    uart_send(0x15);
                    puts("INITIAL ERROR");
                    uart_send(0x04);
                    uart_flush();
                }
                break;
            }
            case 1: {
                if (xstring[1] > VERIFY) {
                    state = 0;
                    uart_send(0x15);
                    puts("INVALID COMMAND");
                    uart_send(0x04);
                    uart_flush();
                }
                else if (xstring[1] == GO) {
                    state = 0;
                    uart_send(0x06);
                    puts("GO TO TARGET");
                    uart_send(0x04);
                    uart_flush();
                    BRANCHTO(ARMBASE);
                }
                else if (xstring[1] == PEEK || xstring[1] == POKE) {
                    state = 133;
                }
                else {
                    state++;
                }
                break;
            }
            case 2: {
                if(xstring[state]==block) {
                    crc+=xstring[state];
                    state++;
                }
                else {
                    state=0;
                    uart_send(0x15);
                    puts("BLOCK ERROR");
                    uart_send(0x04);
                    uart_flush();
                }
                break;
            }
            case 3: {
                if(xstring[state]==(0xFF-xstring[state-1])) {
                    crc+=xstring[state];
                    state++;
                }
                else {
                    state=0;
                    uart_send(0x15);
                    puts("BLOCK ERROR");
                    uart_send(0x04);
                    uart_flush();
                }
                break;
            }
            case 132: {
                crc&=0xFF;
                if(xstring[state]==crc) {
                    if (xstring[1] == LOAD) {
                        for(ra=0;ra<128;ra++) {
                            PUT8(addr++,xstring[ra+4]);
                        }
                        uart_send(0x06);
                    }
                    else {
                        for (ra = 0; ra < 128; ra++, addr++) {
                            if (xstring[ra + 4] != (GET8(addr) & 0xff)) {
                                error_addr = addr;
                                break;
                            }
                        }
                        uart_send(0x06);
                    }
                    block=(block+1) & 0xFF;
                }
                else {
                    uart_send(0x15);
                    puts("CRC ERROR");
                    uart_send(0x04);
                    uart_flush();
                }
                state=0;
                break;
            }
            case 136: {
                if (xstring[1] == PEEK) {
                    unsigned int peek_addr = 0;
                    for (ra = 0; ra < 4; ra++) {
                        peek_addr = peek_addr << 8 | xstring[ra + 133];
                    }
                    uart_send(0x06);
                    puts("PEEK");
                    hexstring(GET32(peek_addr));
                    uart_send(0x04);
                    uart_flush();
                    state = 0;
                }
                else {
                    state++;
                }
                break;
            }
            case 140: {
                if (xstring[1] == POKE) {
                    unsigned int poke_addr = 0x00000000;
                    unsigned int poke_data = 0;
                    for (ra = 0; ra < 4; ra++) {
                        poke_addr = poke_addr << 8 | xstring[ra + 133];
                        poke_data = poke_data << 8 | xstring[ra + 137];
                    }
                    uart_send(0x06);
                    puts("POKE");
                    PUT32(poke_addr, poke_data);
                    uart_send(0x04);
                    uart_flush();
                    state = 0;
                }
                else {
                    state = 0;
                }
                break;
            }
            default: {
                crc+=xstring[state];
                state++;
                break;
            }
        }
    }
    return(0);
}

void puts(char* s) {
    int i = 0;
    while(s[i] != '\0') {
        uart_send(s[i++]);
    }
    uart_send(0x0D);
    uart_send(0x0A);
}

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------


//-------------------------------------------------------------------------
//
// Copyright (c) 2012 David Welch dwelch@dwelch.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//-------------------------------------------------------------------------
```

``` gas vectors.s https://gist.github.com/nilennoct/5597408

;@-------------------------------------------------------------------------
;@-------------------------------------------------------------------------

.globl _start
_start:
    b skip

.space 0x200000-0x8004,0

skip:
    mov sp,#0x08000000
    bl notmain
hang: b hang

.globl PUT32
PUT32:
    str r1,[r0]
    bx lr

.globl PUT16
PUT16:
    strh r1,[r0]
    bx lr

.globl PUT8
PUT8:
    strb r1,[r0]
    bx lr

.globl GET32
GET32:
    ldr r0,[r0]
    bx lr

.globl GET8
GET8:
    ldrb r0,[r0]
    bx lr

.globl GETPC
GETPC:
    mov r0,lr
    bx lr

.globl BRANCHTO
BRANCHTO:
    bx r0

.globl dummy
dummy:
    bx lr


;@-------------------------------------------------------------------------
;@-------------------------------------------------------------------------


;@-------------------------------------------------------------------------
;@
;@ Copyright (c) 2012 David Welch dwelch@dwelch.com
;@
;@ Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
;@
;@ The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
;@
;@ THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
;@
;@-------------------------------------------------------------------------
```

``` python xmodem-loader.py https://gist.github.com/nilennoct/5597404
#Need to install the PySerial library first

import sys, getopt
import serial
import time

def open(aport='/dev/ttyUSB0', abaudrate=115200) :
	return serial.Serial(
		port=aport,
		baudrate=abaudrate,     # baudrate
		bytesize=8,             # number of databits
		parity=serial.PARITY_NONE,
		stopbits=1,
		xonxoff=0,              # enable software flow control
		rtscts=0,               # disable RTS/CTS flow control
		timeout=None               # set a timeout value, None for waiting forever
	)

def printLog(sp):
	temp = sp.read()
	while ord(temp) != 0x04:
		write(temp)
		temp = sp.read()

if __name__ == "__main__":

	# Import Psyco if available
	try:
		import psyco
		psyco.full()
		print "Using Psyco..."
	except ImportError:
		pass

	conf = {
		'port': '/dev/ttyUSB0',
		'baud': 115200,
	}

	try:
		opts, args = getopt.getopt(sys.argv[1:], "hqVewvrp:b:a:l:")
	except getopt.GetoptError, err:
		print str(err)
		sys.exit(2)

	for o, a in opts:
		if o == '-p':
			conf['port'] = a
		elif o == '-b':
			conf['baud'] = eval(a)
		else:
			assert False, "unhandled option"

	sp = open(conf['port'], conf['baud'])

#	print args[0]
#	print conf['port']
#	print conf['baud']

	write=sys.stdout.write

	isLoaded = False

	while True:
		print ''
		cmd = raw_input('>> ').split(' ');
		sp.flushInput()

		if cmd[0] == 'go':
			if not isLoaded:
				confirm = raw_input("No file has been loaded, are you sure to go? [Y/N]")
				if confirm == '' or confirm[0] == 'N' or confirm[0] == 'n':
					continue

			success = False
			while success == False:
				sp.write(chr(0x01))
				sp.write(chr(0x01))
				sp.flush()

				temp=sp.read()

				if ord(temp)==0x06:
					success = True
				else:
					print ord(temp)

					printLog(sp)

		elif cmd[0] == 'peek':
			if len(cmd) < 2:
				print "Incorrect command, should be 'peek addr'"
				continue

			addr = int(cmd[1], 16) & 0xffffffff

			success = False
			while success == False:
				sp.write(chr(0x01))
				sp.write(chr(0x02))

				for i in range(0,4):
					sp.write(chr(addr >> 24 & 0xff))
					addr = addr << 8

				sp.flush()

				temp=sp.read()

				if ord(temp)==0x06:
					success = True
				else:
					print ord(temp)

					printLog(sp)

		elif cmd[0] == 'poke':
			if len(cmd) < 3:
				print "Incorrect command, should be 'poke addr data'"
				continue

			addr = int(cmd[1], 16) & 0xffffffff
			data = int(cmd[2], 16) & 0xffffffff

			success = False
			while success == False:
				sp.write(chr(0x01))
				sp.write(chr(0x03))

				for i in range(0,4):
					sp.write(chr(addr >> 24 & 0xff))
					addr = addr << 8
				for i in range(0,4):
					sp.write(chr(data >> 24 & 0xff))
					data = data << 8

				sp.flush()

				temp=sp.read()

				if ord(temp)==0x06:
					success = True
				else:
					print ord(temp)

					printLog(sp)

		elif cmd[0] == 'load' or cmd[0] == 'verify':
			if len(cmd) < 2:
				print "Please input the filename"
				continue

			try:
				data = map(lambda c: ord(c), file(cmd[1],"rb").read())
			except:
				print "File not exist"
				continue

			temp = sp.read()
			buf = ""

			# while ord(temp)!=0x15:
			# 	buf += temp
			# 	temp = sp.read()

			# print buf
			dataLength = len(data)
			blockNum = (dataLength-1)/128+1
			print "The size of the image is ",dataLength,"!"
			print "Total block number is ",blockNum,"!"
			print "Download start,",blockNum,"block(s) in total!"

			for i in range(1,blockNum+1):
				success = False
				while success == False:
					sp.write(chr(0x01))
					if cmd[0] == 'load':
						sp.write(chr(0x00))
					else:
						sp.write(chr(0x04))
					sp.write(chr(i&0xFF))
					sp.write(chr(0xFF-i&0xFF))
					crc = 0x01+0xFF

					for j in range(0,128):
						if len(data)>(i-1)*128+j:
							sp.write(chr(data[(i-1)*128+j]))
							crc += data[(i-1)*128+j]
						else:
							sp.write(chr(0xff))
							crc += 0xff

					crc &= 0xff
					sp.write(chr(crc))
					sp.flush()

					# !important!
					# time.sleep(0.1)

					temp=sp.read()
					sp.flushInput()

					if ord(temp)==0x06:
						success = True
						print "Block",i,"has finished!"
					else:
						print ord(temp)
						print "Error,send again!"

						printLog(sp)

			sp.write(chr(0x04))
			sp.flush()
			temp=sp.read()

			if ord(temp)==0x06:
				if (cmd[0] == 'load'):
					isLoaded = True
				print "Download has finished!\n"
		elif cmd[0] == 'q' or cmd[0] == 'quit' or cmd[0] == 'exit':
			sys.exit(0)
		else:
			print "Invalid command!"


		printLog(sp)


	# while True:
	# 	write(sp.read())

	sp.close()
```
