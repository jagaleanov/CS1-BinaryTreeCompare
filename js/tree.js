// JavaScript Document
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

    //Buscar nodo por id, se usa solo para añadir nodos al buscar al padre, 
    //el id permite que existan varios nodos con el mismo valor y que se puedan añadir en el punto deseado
    //además permite llevar facilmente el conteo de nodos en un árbol
    findId(head, id) {
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
                return false;
            }
        } else {
            return false;
        }
    }

    //Buscar nodo por valor, se usa para las comparaciones
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
            if (this.head == null) {
                this.head = newNode;
                return true;
            } else {
                alert("El nodo ya esta ocupado.");
                return false;
            }

        } else {
            var parentNode = this.findId(this.head, parentId);

            if (direction === "left") {
                if (parentNode.left === null) {
                    newNode.parent = parentNode;
                    parentNode.left = newNode;
                    return true;
                } else {
                    alert("El nodo ya esta ocupado.");
                    return false;
                }

            } else if (direction === "right") {
                if (parentNode.right === null) {
                    newNode.parent = parentNode;
                    parentNode.right = newNode;
                    return true;
                } else {
                    alert("El nodo ya esta ocupado.");
                    return false;
                }
            } else {
                return false;
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

    //revisa si los arboles tienen la misma forma sin importar los valores
    hasSameRelations(headA, headB) {
        //console.log("Comparando nodo a:");
        //console.log(headA);
        //console.log("Comparando nodo b:");
        //console.log(headB);

        if (headA === null) {
            if (headB === null) {
                //console.log("Ambos nodos son nulos, TRUE");
                return true;
            } else {
                //console.log("Solo A es nulo, FALSE");
                return false;
            }
        } else {
            if (headB !== null) {
                //console.log("Ambos estan llenos (recursion)");
                return this.hasSameRelations(headA.left, headB.left) && this.hasSameRelations(headA.right, headB.right);
            } else {
                //console.log("Solo B es nulo, FALSE");
                return false;
            }
        }
    }

    //revisa si todos los nodos del árbol A se encuentran en el arbol B
    hasSameNodes(headA, headB) {
        if (headA === null) {
            return true;
        } else {
            if (this.findValue(headB, headA.value)) {
                return this.hasSameNodes(headA.left, headB) && this.hasSameNodes(headA.right, headB);
            } else {
                return false;
            }
        }
    }

    //recorre los 2 árboles paralelamente hasta encontrar alguna diferencia o devuelve true (recursivo)
    isEqual(headA, headB) {
        if (headA === null) {
            if (headB === null) {
                return true;
            } else {
                return false;
            }
        } else {
            if (headB !== null && headA.value === headB.value) {
                if (this.isEqual(headA.left, headB.left) && this.isEqual(headA.right, headB.right)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    isEqualTo(otherTree) {
        //si tienen la misma cantidad de nodos y son iguales al recorrerlos de forma paralela
        return this.nodeCounter === otherTree.nodeCounter && this.isEqual(this.head, otherTree.head);
    }

    isSimilarTo(otherTree) {
        //si tienen la misma cantidad de nodos 
        //y NO son iguales
        //y tienen las mismas relaciones 
        //y (NO todos los nodos de A estan contenidos en B  o  NO todos los nodos de B estan contenidos en A)
        return this.nodeCounter === otherTree.nodeCounter &&
            !this.isEqual(this.head, otherTree.head) &&
            this.hasSameRelations(this.head, otherTree.head) &&
            !(this.hasSameNodes(this.head, otherTree.head) && this.hasSameNodes(otherTree.head, this.head));
    }

    //Semejantes
    isLike(otherTree) {
        //si tienen la misma cantidad de nodos 
        //y NO son iguales
        //y NO tienen las mismas relaciones 
        //y (todos los nodos de A estan contenidos en B  y  todos los nodos de B estan contenidos en A)
        return this.nodeCounter === otherTree.nodeCounter &&
            !this.isEqual(this.head, otherTree.head) &&
            !this.hasSameRelations(this.head, otherTree.head) &&
            (this.hasSameNodes(this.head, otherTree.head) && this.hasSameNodes(otherTree.head, this.head));
    }

    isDistinctTo(otherTree) {
        //si NO tienen la misma cantidad de nodos o
        //(NO son iguales
        //y NO tienen las mismas relaciones 
        //y (NO todos los nodos de A estan contenidos en B  o  NO todos los nodos de B estan contenidos en A)))
        return this.nodeCounter !== otherTree.nodeCounter ||
            (
                !this.isEqual(this.head, otherTree.head) &&
                !this.hasSameRelations(this.head, otherTree.head) &&
                !(this.hasSameNodes(this.head, otherTree.head) && this.hasSameNodes(otherTree.head, this.head))
            );
    }
}

var treeA = new Tree();
var treeB = new Tree();

function addNode() {
    var error = false;

    //revisar a que arbol va a añadir
    if ($('#treeTxt').val() === "A") {
        var tree = treeA;
    } else if ($('#treeTxt').val() === "B") {
        var tree = treeB;
    }

    if ($('#parentTxt').val() !== "root") {//si el padre es diferente a la raiz
        if ($('#directionTxt').val() === null) {//si la dirección esta vacía
            alert("Seleccione una dirección para el nodo");
            error = true;
        } else {
            if (!tree.addNode($('#parentTxt').val(), $('#directionTxt').val(), $('#valueTxt').val())) {
                error = true;
            }
        }
    } else {
        if (!tree.addNode($('#parentTxt').val(), $('#directionTxt').val(), $('#valueTxt').val())) {
            error = true;
        }
    }

    if (!error) {
        $('#directionTxt').val("");
        $('#valueTxt').val("");
        $('#formModal').modal('hide');
        printTrees();
    }
}

function printTrees() {
    if (treeA.head === null) {//si aun no hay raiz
        $('#addRootA').show();//mostrar boton de insertar raiz
        $('#ulTreeA').html("Árbol vacío");
    } else {
        $('#addRootA').hide();//ocultar boton de insertar raiz
        $('#ulTreeA').html(treeA.toHTML(treeA.head, "A"));//imprimir arbol
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

    var equal = treeA.isEqualTo(treeB);
    var similar = treeA.isSimilarTo(treeB);
    var like = treeA.isLike(treeB);
    var distinct = treeA.isDistinctTo(treeB);

    if (equal) {
        $('#equalString').html("Verdadero");//colocar valor
        $('#equalString').attr("class", "badge badge-success");//colocar color
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

$(document).ready(function () {//cuando el documento acabe de cargar
    printTrees();//imprimir arboles

    $('#formModal').on('show.bs.modal', function (event) {//listener botones
        var button = $(event.relatedTarget); // Boton q inicia el div modal
        var parent = button.data('parent'); // Extrae la info del atributo data-parent 
        var parentValue = button.data('parent-value'); // Extrae la info del atributo data-parent-value 
        var tree = button.data('tree'); // Extrae la info del atributo data-tree
        var modal = $(this);

        if (parent === "root") {//si estamos añadiendo a la raiz
            modal.find('#directionDiv').hide();//ocultar campo direccion
        } else {//sino
            modal.find('#directionDiv').show();//mostrarlo
        }

        modal.find('.modal-title').text('Nuevo nodo en ' + parentValue + ' en el Árbol ' + tree);
        modal.find('#parentTxt').val(parent);//llenar el campo parent oculto en el form 
        modal.find('#treeTxt').val(tree);//llenar el campo tree oculto en el form 
    });
});
