// script.js

class BinaryHeap {
    constructor() {
        this.heap = [];
    }

    insert(value) {
        this.heap.push(value);
        this.bubbleUp();
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.size() === 0;
    }

    bubbleUp() {
        let index = this.size() - 1;
        const element = this.heap[index];

        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            let parent = this.heap[parentIndex];

            if (element[0] >= parent[0]) break;

            this.heap[parentIndex] = element;
            this.heap[index] = parent;
            index = parentIndex;
        }
    }

    extractMin() {
        if (this.isEmpty()) return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (!this.isEmpty()) {
            this.heap[0] = end;
            this.sinkDown(0);
        }
        return min;
    }

    sinkDown(index) {
        const length = this.size();
        const element = this.heap[index];

        while (true) {
            let leftChildIdx = 2 * index + 1;
            let rightChildIdx = 2 * index + 2;
            let swap = null;

            if (leftChildIdx < length) {
                let leftChild = this.heap[leftChildIdx];
                if (leftChild[0] < element[0]) {
                    swap = leftChildIdx;
                }
            }

            if (rightChildIdx < length) {
                let rightChild = this.heap[rightChildIdx];
                if (
                    (swap === null && rightChild[0] < element[0]) ||
                    (swap !== null && rightChild[0] < this.heap[swap][0])
                ) {
                    swap = rightChildIdx;
                }
            }

            if (swap === null) break;
            this.heap[index] = this.heap[swap];
            this.heap[swap] = element;
            index = swap;
        }
    }
}

class HuffmanCoder {
    constructor() {
        this.heap = new BinaryHeap();
        this.mappings = {};
        this.root = null;
    }

    stringify(node) {
        if (typeof node === "string") {
            return `'${node}`;
        }
        return `0${this.stringify(node[0])}1${this.stringify(node[1])}`;
    }

    destringify(data) {
        this.index = 0;
        return this._destringifyHelper(data);
    }

    _destringifyHelper(data) {
        if (this.index >= data.length) return null;

        const char = data[this.index];
        if (char === "'") {
            this.index++;
            const leaf = data[this.index];
            this.index++;
            return leaf;
        }

        if (char === '0') {
            this.index++;
            const left = this._destringifyHelper(data);
            if (data[this.index] !== '1') {
                throw new Error("Invalid serialization format.");
            }
            this.index++;
            const right = this._destringifyHelper(data);
            return [left, right];
        }

        throw new Error("Invalid serialization format.");
    }

    display(node, index = 1) {
        if (typeof node === "string") {
            return `${index} = ${node}`;
        }

        let left = this.display(node[0], index * 2);
        let right = this.display(node[1], index * 2 + 1);
        let res = `${index * 2} <= ${index} => ${index * 2 + 1}`;
        return `${res}\n${left}\n${right}`;
    }

    getMappings(node, path) {
        if (typeof node === "string") {
            this.mappings[node] = path;
            return;
        }

        this.getMappings(node[0], path + "0");
        this.getMappings(node[1], path + "1");
    }

    encode(data) {
        // Reset heap and mappings
        this.heap = new BinaryHeap();
        this.mappings = {};

        // Frequency map
        const freqMap = {};
        for (let char of data) {
            freqMap[char] = (freqMap[char] || 0) + 1;
        }

        // Insert all characters into the heap
        for (const [char, freq] of Object.entries(freqMap)) {
            this.heap.insert([freq, char]);
        }

        // Edge case: empty data
        if (this.heap.isEmpty()) {
            throw new Error("Cannot encode empty data.");
        }

        // Edge case: single unique character
        if (this.heap.size() === 1) {
            const singleNode = this.heap.extractMin();
            this.root = [singleNode[1], null];
        } else {
            // Build Huffman Tree
            while (this.heap.size() > 1) {
                const node1 = this.heap.extractMin();
                const node2 = this.heap.extractMin();
                const merged = [node1[1], node2[1]];
                const mergedFreq = node1[0] + node2[0];
                this.heap.insert([mergedFreq, merged]);
            }
            this.root = this.heap.extractMin()[1];
        }

        // Generate mappings
        this.getMappings(this.root, "");

        // Encode the data
        let binaryString = "";
        for (let char of data) {
            binaryString += this.mappings[char];
        }

        // Calculate padding
        const padding = (8 - (binaryString.length % 8)) % 8;
        binaryString = binaryString.padEnd(binaryString.length + padding, '0');

        // Convert binary string to bytes
        const byteArray = [];
        for (let i = 0; i < binaryString.length; i += 8) {
            const byte = binaryString.slice(i, i + 8);
            byteArray.push(parseInt(byte, 2));
        }
        const binaryData = String.fromCharCode(...byteArray);

        // Serialize the tree
        const serializedTree = this.stringify(this.root);

        // Combine serialized tree, padding, and binary data
        const finalResult = `${serializedTree}\n${padding}\n${binaryData}`;

        // Calculate compression ratio
        const originalSize = new TextEncoder().encode(data).length;
        const compressedSize = new TextEncoder().encode(finalResult).length;
        const compressionRatio = (originalSize / compressedSize).toFixed(2);

        const info = `Compression complete.\nCompression Ratio: ${compressionRatio}:1`;

        return [finalResult, this.display(this.root), info];
    }

    decode(data) {
        const parts = data.split('\n');
        if (parts.length < 3) {
            throw new Error("Invalid encoded data format.");
        }

        // Reconstruct the serialized tree (might contain newlines)
        let serializedTree = "";
        let padding;
        let binaryData;
        if (parts.length === 3) {
            [serializedTree, padding, binaryData] = parts;
        } else {
            // Handle cases where the serialized tree contains newlines
            padding = parts[parts.length - 2];
            binaryData = parts[parts.length - 1];
            serializedTree = parts.slice(0, parts.length - 2).join('\n');
        }

        // Deserialize the tree
        this.root = this.destringify(serializedTree);

        // Decode binary data
        let binaryString = "";
        for (let char of binaryData) {
            const byte = char.charCodeAt(0);
            let bits = byte.toString(2).padStart(8, '0');
            binaryString += bits;
        }

        // Remove padding
        const paddingCount = parseInt(padding, 10);
        if (isNaN(paddingCount) || paddingCount < 0 || paddingCount > 7) {
            throw new Error("Invalid padding information.");
        }
        binaryString = binaryString.slice(0, binaryString.length - paddingCount);

        // Decode the binary string using the Huffman tree
        let decoded = "";
        let node = this.root;
        for (let bit of binaryString) {
            node = bit === '0' ? node[0] : node[1];
            if (typeof node === "string") {
                decoded += node;
                node = this.root;
            }
        }

        const info = "Decompression complete. File has been downloaded.";

        return [decoded, this.display(this.root), info];
    }
}

window.onload = function () {
    // Get references to elements
    const treearea = document.getElementById('treearea');
    const encodeBtn = document.getElementById('encode');
    const decodeBtn = document.getElementById('decode');
    const temptext = document.getElementById('temptext');
    const upload = document.getElementById('uploadedFile');

    const coder = new HuffmanCoder();

    upload.addEventListener('change', () => {
        if (upload.files.length > 0) {
            temptext.innerText = `Selected file: ${upload.files[0].name}`;
        } else {
            temptext.innerText = "No file selected.";
        }
    });

    encodeBtn.onclick = function () {
        const uploadedFile = upload.files[0];
        if (!uploadedFile) {
            alert("No file uploaded!");
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            const text = fileLoadedEvent.target.result;
            if (text.length === 0) {
                alert("Text cannot be empty! Upload another file.");
                return;
            }
            try {
                let [encoded, tree_structure, info] = coder.encode(text);
                downloadFile(`${uploadedFile.name.split('.')[0]}_encoded.txt`, encoded);
                treearea.innerText = tree_structure;
                temptext.innerText = info;
            } catch (error) {
                alert(`Encoding failed: ${error.message}`);
                console.error(error);
            }
        };
        fileReader.onerror = function () {
            alert("Error reading the file. Please try again.");
        };
        fileReader.readAsText(uploadedFile, "UTF-8");
    };

    decodeBtn.onclick = function () {
        const uploadedFile = upload.files[0];
        if (!uploadedFile) {
            alert("No file uploaded!");
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            const text = fileLoadedEvent.target.result;
            if (text.length === 0) {
                alert("Encoded text cannot be empty! Upload another file.");
                return;
            }
            try {
                let [decoded, tree_structure, info] = coder.decode(text);
                downloadFile(`${uploadedFile.name.split('.')[0]}_decoded.txt`, decoded);
                treearea.innerText = tree_structure;
                temptext.innerText = info;
            } catch (error) {
                alert(`Decoding failed: ${error.message}`);
                console.error(error);
            }
        };
        fileReader.onerror = function () {
            alert("Error reading the file. Please try again.");
        };
        fileReader.readAsText(uploadedFile, "UTF-8");
    };
};

function downloadFile(fileName, data) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
