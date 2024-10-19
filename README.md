# File Zipper: Huffman Encoding-based File Compression
**This project, File Zipper, is a simple file compression tool that uses the concept of Huffman Encoding to compress and decompress .txt files. It allows users to upload a text file, compress it using Huffman encoding, and later decompress it back to its original form. The tool also displays the Huffman Tree used for encoding and provides insights into the compression process.**

Features
File Upload: Upload any .txt file to be compressed.
Huffman Tree Visualization: View the structure of the Huffman Tree used for encoding.
Encoding and Decoding: Compress a file to reduce its size and decompress it back to its original form.
Compression Info: Displays compression ratio and other details after encoding.
Download: Download the compressed or decompressed file.
How it Works
Huffman Encoding
Huffman encoding is a popular algorithm used for lossless data compression. It assigns shorter binary codes to characters that occur more frequently in the file and longer codes to less frequent characters, reducing the overall file size.

Compression Process
Frequency Calculation: The tool calculates the frequency of each character in the uploaded file.
Huffman Tree Creation: A binary tree is built using the character frequencies.
Binary Encoding: Each character is replaced by its corresponding binary code derived from the Huffman tree.
File Compression: The encoded data, Huffman tree, and necessary padding are combined and saved as the compressed file.
Decompression Process
Tree Deserialization: The saved Huffman tree is reconstructed from the compressed file.
Binary Decoding: The binary data is decoded back to the original text using the tree.
File Restoration: The original text is restored and can be downloaded.
Tech Stack
HTML/CSS/JavaScript: For building the front-end interface and managing user interactions.
Bootstrap: For responsive UI elements.
JavaScript Classes: Implement the core logic for Huffman Encoding, Binary Heap, file handling, and Huffman Tree operations.
Files
index.html: Main webpage interface for the File Zipper tool.
script.js: Contains the JavaScript logic for Huffman encoding, file handling, and UI interaction.
style.css: Stylesheet for the user interface.
Usage Instructions
Upload a File: Click on the "Choose File" button and upload a .txt file.
Encode the File: Press the Encode button to compress the file. The Huffman Tree and compression info will be displayed, and the compressed file will be available for download.
Decode the File: Upload a previously compressed file and press the Decode button to restore the original text.
Demo
Upload a text file (e.g., example.txt).
Click Encode to compress the file and download the compressed version.
Upload the compressed file and click Decode to restore and download the original file.
Installation & Setup
No installation is required. Simply clone the repository and open index.html in your browser to use the tool locally.
