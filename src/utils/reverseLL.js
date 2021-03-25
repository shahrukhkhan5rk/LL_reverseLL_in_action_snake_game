export function reverseLinkedList(head) {
    let previousNode = null;
    let currentNode = head;
    while (currentNode !== null) {
      const nextNode = currentNode.next;
      currentNode.next = previousNode;
      previousNode = currentNode;
      currentNode = nextNode;
    }
    return previousNode;
  }