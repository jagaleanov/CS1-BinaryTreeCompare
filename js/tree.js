
class Node {
    id;
    value;
    left;
    right;
    parent;

    constructor(id, value) {
        this.id = id;
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class Tree {
    head;
    nodeCounter;

    constructor() {
        this.head = null;
        this.nodeCounter = 0;
    }

    findId(head, id) {
        //console.log("Iniciando busqueda de " + id + " en");
        //console.log(head);
        if (head !== null) {
            var leftSearch = this.findId(head.left, id);
            var rightSearch = this.findId(head.right, id);

            if (parseInt(id) === head.id) {
                return head;
            } else if (leftSearch !== false) {
                return leftSearch;
            } else if (rightSearch !== false) {
                return rightSearch;
            } else {
                //console.log("No hay donde buscar, false");
                return false;
            }
        } else {
            //console.log("No hay donde buscar, false");
            return false;
        }
    }

    findValue(head, value) {
        if (head !== null) {
            var leftSearch = this.findValue(head.left, value);
            var rightSearch = this.findValue(head.right, value);

            if (value === head.value) {
                return head;
            } else if (leftSearch !== null) {
                return leftSearch;
            } else if (rightSearch !== null) {
                return rightSearch;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    addNode(parentId, direction, value) {
        this.nodeCounter++;
        var newNode = new Node(this.nodeCounter, value);

        if (parentId === "root") {
            this.head = newNode;
        } else {
            var parentNode = this.findId(this.head, parentId);

            newNode.parent = parentNode;

            if (direction === "left") {
                parentNode.left = newNode;
            } else if (direction === "right") {
                parentNode.right = newNode;
            }
        }
    }

    toHTML(head, treeId) {
        var html = "";

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            var htmlLeft = this.toHTML(head.left, treeId);
            var htmlRight = this.toHTML(head.right, treeId);

            html = '<li>' +
                    '<div class="rounded-pill px-2 py-1" data-toggle="modal" data-target="#formModal" data-parent="' + head.id + '" data-parent-value="' + head.value + '" data-tree="' + treeId + '">' +
                    head.value +
                    '</div>';

            if (!(head.left === null && head.right === null)) {

                html += '<ul>' +
                        htmlLeft +
                        htmlRight +
                        '</ul>' +
                        '</li>';
            }

            html += '</li>';
        }

        return html;
    }

    hasSameRelations(headA, headB) {
        //console.log("Iniciando comparacion headA");
        //console.log(headA);
        //console.log("Iniciando comparacion headB");
        //console.log(headB);
        if (headA === null) {
            if (headB === null) {
                //console.log("ambos son nulos, true");
                return true;
            } else {
                //console.log("solo A es nulo, false");
                return false;
            }
        } else {
            if (headB !== null) {
                //console.log("hijos iguales, recursion");
                return this.hasSameRelations(headA.left, headB.left) && this.hasSameRelations(headA.right, headB.right);
            } else {
                //console.log("hijos distintos, false");
                return false;
            }

        }
    }

    hasSameNodes(headA, headB) {
        //console.log("Iniciando comparacion headA");
        //console.log(headA);
        //console.log("Iniciando comparacion headB");
        //console.log(headB);
        if (headA === null) {
            //console.log("No hay mas valores en A para buscar, true");
            return true;
        } else {
            if (this.findValue(headB, headA.value)) {
                //console.log("valor encontrado, recursion");
                return this.hasSameNodes(headA.left, headB) && this.hasSameNodes(headA.right, headB);
            } else {
                //console.log("valor NO encontrado, false");
                return false;
            }
        }
    }

    isEqualTo(headA, headB) {
        if (headA === null) {
            if (headB === null) {
                return true;
            } else {
                return false;
            }
        } else {
            if (headB !== null && headA.value === headB.value) {
                if (this.isEqualTo(headA.left, headB.left) && this.isEqualTo(headA.right, headB.right)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    isSimilarTo(headB) {
        return this.hasSameRelations(this.head, headB) &&
                !(this.hasSameNodes(this.head, headB) && this.hasSameNodes(headB, this.head)) &&
                !this.isEqualTo(this.head, headB);
    }

    isLike(headB) {
        return !this.hasSameRelations(this.head, headB) &&
                (this.hasSameNodes(this.head, headB) && this.hasSameNodes(headB, this.head)) &&
                !this.isEqualTo(this.head, headB);
    }

    isDistinctTo(headB) {
        return !this.hasSameRelations(this.head, headB) &&
                !(this.hasSameNodes(this.head, headB) && this.hasSameNodes(headB, this.head));
    }
}

var treeA = new Tree();
var treeB = new Tree();

function addNode() {

    var error = false;

    if ($('#treeTxt').val() === "A") {
        var tree = treeA;
    } else if ($('#treeTxt').val() === "B") {
        var tree = treeB;
    }

    if ($('#parentTxt').val() !== "root") {
        console.log("añadiendo a " + $('#parentTxt').val());
        console.log($('#directionTxt').val());

        if ($('#directionTxt').val() === null) {
            alert("Seleccione una dirección para el nodo");
            error = true;
        } else {
            tree.addNode($('#parentTxt').val(), $('#directionTxt').val(), $('#valueTxt').val());
        }
    } else {
        console.log("añadiendo a root");
        tree.addNode($('#parentTxt').val(), $('#directionTxt').val(), $('#valueTxt').val());
    }

    if (!error) {
        $('#directionTxt').val("");
        $('#valueTxt').val("");
        $('#formModal').modal('hide');
        printTrees();
    }
}

function printTrees() {
    if (treeA.head === null) {
        $('#addRootA').show();
        $('#ulTreeA').html("Árbol vacío");
    } else {
        $('#addRootA').hide();
        $('#ulTreeA').html(treeA.toHTML(treeA.head, "A"));
    }

    if (treeB.head === null) {
        $('#addRootB').show();
        $('#ulTreeB').html("Árbol vacío");
    } else {
        $('#addRootB').hide();
        $('#ulTreeB').html(treeB.toHTML(treeB.head, "B"));
    }

    printCompare();
}

function printCompare() {

    var equal = treeA.isEqualTo(treeA.head, treeB.head);
    var similar = treeA.isSimilarTo(treeB.head);
    var like = treeA.isLike(treeB.head);
    var distinct = treeA.isDistinctTo(treeB.head);

    if (equal) {
        $('#equalString').html("Verdadero");
        $('#equalString').attr("class", "badge badge-success");
    } else {
        $('#equalString').html("Falso");
        $('#equalString').attr("class", "badge badge-danger");
    }
    if (similar) {
        $('#similarString').html("Verdadero");
        $('#similarString').attr("class", "badge badge-success");
    } else {
        $('#similarString').html("Falso");
        $('#similarString').attr("class", "badge badge-danger");
    }
    if (like) {
        $('#likeString').html("Verdadero");
        $('#likeString').attr("class", "badge badge-success");
    } else {
        $('#likeString').html("Falso");
        $('#likeString').attr("class", "badge badge-danger");
    }
    if (distinct) {
        $('#distinctString').html("Verdadero");
        $('#distinctString').attr("class", "badge badge-success");
    } else {
        $('#distinctString').html("Falso");
        $('#distinctString').attr("class", "badge badge-danger");
    }
}

$(document).ready(function () {
    printTrees();

    $('#formModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var parent = button.data('parent'); // Extract info from data-* attributes
        var parentValue = button.data('parent-value'); // Extract info from data-parent-value* attributes
        var tree = button.data('tree'); // Extract info from data-tree* attributes
        var modal = $(this);

        if (parent === "root") {
            modal.find('#directionDiv').hide();
        } else {
            modal.find('#directionDiv').show();
        }

        modal.find('.modal-title').text('Nuevo nodo en ' + parentValue + ' en el Árbol ' + tree);
        modal.find('#parentTxt').val(parent);
        modal.find('#parentValueTxt').val(parentValue);
        modal.find('#treeTxt').val(tree);
        $('#valueTxt').focus();
    });
});
