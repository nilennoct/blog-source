---
layout: page
title: "NeoID3 - A Mac app used to convert MP3 tags"
date: 2014-05-19 10:49
comments: true
sharing: true
footer: true
---
> [中文版](/neoid3)

## About

[NeoID3](https://github.com/nilennoct/NeoID3) is a simple Mac app used to convert MP3 tags encoding to UTF-8.

> ID3 is a metadata container most often used in conjunction with the MP3 audio file format. It allows information such as the title, artist, album, track number, and other information about the file to be stored in the file itself.

> From [Wikipedia](http://en.wikipedia.org/wiki/ID3 "ID3").

In ID3v2, tags can be stored in several encodings, such as ISO-8859-1 and UTF-8, while the media palyers in common use, like iTunes and Vox, can only read tags encoded in UTF-8.

## Feature
 
 - Detect encoding automatically (powered by [uchardet](https://code.google.com/p/uchardet/ "uchardet"));
 - Convert multiple files;
 - Edit MP3 ID3 tag.

## Support encodings

- UTF-8
- GB18030
- BIG5
- SHIFT_JIS
- EUC-KR

## Build

To build this project, you need install TagLib and uchardet at first.

``` bash
# use homebrew
brew install taglib uchardet
```
	
Tested on Mac OS X 10.9.3 & Xcode 5.1.1.
 
## Notice
 
This app uses [TagLib](http://taglib.github.io "TagLib") to read and write ID3 tags. After converting, the MP3 file's tag would be updated to ID3v2.4. Please check whether your media player supports ID3v2.4 before converting.

For example, if you would enjoy your music both in Mac OS and in Windows, you should notice the fact below:

> Windows Explorer and Windows Media Player cannot handle ID3v2.4 tags in any version, up to and including Windows 8 / Windows Media Player 12. Windows can understand ID3v2 up to and including version 2.3.[\[1\]][1][\[2\]][2]

[<img src="../image/NeoID3-Download.png" alt="Download" />](http://pan.baidu.com/s/1kT9g7cz "Download NeoID3 Now!")

[1]: http://arstechnica.com/features/2012/10/a-work-in-progress-the-windows-8-multimedia-experience/2/ "Music and Video in Windows 8: a work in progress"
 
[2]: http://answers.microsoft.com/en-us/windows/forum/windows_7-pictures/how-to-add-id3v24-support-for-windows-7-64bit/a9427521-eb6f-4fe4-affb-f61532846503 "Microsoft support community"