/*
 loglevel-emoji.js v0.1 (2013-01-11)
 (c) 2021 Paulo P. MIT License
*/

/**
 * findAndReplaceDOMText v 0.2
 * @author James Padolsey http://james.padolsey.com
 * @license http://unlicense.org/UNLICENSE
 *
 * Matches the text of a DOM node against a regular expression
 * and replaces each match (or node-separated portions of the match)
 * in the specified element.
 *
 * Example: Wrap 'test' in <em>:
 *   <p id="target">This is a test</p>
 *   <script>
 *     findAndReplaceDOMText(
 *       /test/,
 *       document.getElementById('target'),
 *       'em'
 *     );
 *   </script>
 */
window.findAndReplaceDOMText = (function() {

  /** 
   * findAndReplaceDOMText
   * 
   * Locates matches and replaces with replacementNode
   *
   * @param {RegExp} regex The regular expression to match
   * @param {Node} node Element or Text node to search within
   * @param {String|Element|Function} replacementNode A NodeName,
   *  Node to clone, or a function which returns a node to use
   *  as the replacement node.
   * @param {Number} captureGroup A number specifiying which capture
   *  group to use in the match. (optional)
   */
  function findAndReplaceDOMText(regex, node, replacementNode, captureGroup) {

    var m, matches = [], text = _getText(node);
    var replaceFn = _genReplacer(replacementNode);

    if (!text) { return; }

    if (regex.global) {
      while (m = regex.exec(text)) {
        matches.push(_getMatchIndexes(m, captureGroup));
      }
    } else {
      m = text.match(regex);
      matches.push(_getMatchIndexes(m, captureGroup));
    }

    if (matches.length) {
      _stepThroughMatches(node, matches, replaceFn);
    }
  }

  /**
   * Gets the start and end indexes of a match
   */
  function _getMatchIndexes(m, captureGroup) {

    captureGroup = captureGroup || 0;
 
    if (!m[0]) throw 'findAndReplaceDOMText cannot handle zero-length matches';
 
    var index = m.index;

    if (captureGroup > 0) {
      var cg = m[captureGroup];
      if (!cg) throw 'Invalid capture group';
      index += m[0].indexOf(cg);
      m[0] = cg;
    } 

    return [ index, index + m[0].length, [ m[0] ] ];
  };

  /**
   * Gets aggregate text of a node without resorting
   * to broken innerText/textContent
   */
  function _getText(node) {

    if (node.nodeType === 3) {
      return node.data;
    }

    var txt = '';

    if (node = node.firstChild) do {
      txt += _getText(node);
    } while (node = node.nextSibling);

    return txt;

  }

  /** 
   * Steps through the target node, looking for matches, and
   * calling replaceFn when a match is found.
   */
  function _stepThroughMatches(node, matches, replaceFn) {

    var after, before,
        startNode,
        endNode,
        startNodeIndex,
        endNodeIndex,
        innerNodes = [],
        atIndex = 0,
        curNode = node,
        matchLocation = matches.shift(),
        matchIndex = 0;

    out: while (true) {

      if (curNode.nodeType === 3) {
        if (!endNode && curNode.length + atIndex >= matchLocation[1]) {
          // We've found the ending
          endNode = curNode;
          endNodeIndex = matchLocation[1] - atIndex;
        } else if (startNode) {
          // Intersecting node
          innerNodes.push(curNode);
        }
        if (!startNode && curNode.length + atIndex > matchLocation[0]) {
          // We've found the match start
          startNode = curNode;
          startNodeIndex = matchLocation[0] - atIndex;
        }
        atIndex += curNode.length;
      }

      if (startNode && endNode) {
        curNode = replaceFn({
          startNode: startNode,
          startNodeIndex: startNodeIndex,
          endNode: endNode,
          endNodeIndex: endNodeIndex,
          innerNodes: innerNodes,
          match: matchLocation[2],
          matchIndex: matchIndex
        });
        // replaceFn has to return the node that replaced the endNode
        // and then we step back so we can continue from the end of the 
        // match:
        atIndex -= (endNode.length - endNodeIndex);
        startNode = null;
        endNode = null;
        innerNodes = [];
        matchLocation = matches.shift();
        matchIndex++;
        if (!matchLocation) {
          break; // no more matches
        }
      } else if (curNode.firstChild || curNode.nextSibling) {
        // Move down or forward:
        curNode = curNode.firstChild || curNode.nextSibling;
        continue;
      }

      // Move forward or up:
      while (true) {
        if (curNode.nextSibling) {
          curNode = curNode.nextSibling;
          break;
        } else if (curNode.parentNode !== node) {
          curNode = curNode.parentNode;
        } else {
          break out;
        }
      }

    }

  }

  var reverts;
  /**
   * Reverts the last findAndReplaceDOMText process
   */
  findAndReplaceDOMText.revert = function revert() {
    for (var i = 0, l = reverts.length; i < l; ++i) {
      reverts[i]();
    }
    reverts = [];
  };

  /** 
   * Generates the actual replaceFn which splits up text nodes
   * and inserts the replacement element.
   */
  function _genReplacer(nodeName) {

    reverts = [];

    var makeReplacementNode;

    if (typeof nodeName != 'function') {
      var stencilNode = nodeName.nodeType ? nodeName : document.createElement(nodeName);
      makeReplacementNode = function(fill) {
        var clone = document.createElement('div'),
            el;
        clone.innerHTML = stencilNode.outerHTML || new XMLSerializer().serializeToString(stencilNode);
        el = clone.firstChild;
        if (fill) {
          el.appendChild(document.createTextNode(fill));
        }
        return el;
      };
    } else {
      makeReplacementNode = nodeName;
    }

    return function replace(range) {

      var startNode = range.startNode,
          endNode = range.endNode,
          matchIndex = range.matchIndex;

      if (startNode === endNode) {
        var node = startNode;
        if (range.startNodeIndex > 0) {
          // Add `before` text node (before the match)
          var before = document.createTextNode(node.data.substring(0, range.startNodeIndex));
          node.parentNode.insertBefore(before, node);
        }

        // Create the replacement node:
        var el = makeReplacementNode(range.match[0], matchIndex);
        node.parentNode.insertBefore(el, node);
        if (range.endNodeIndex < node.length) {
          // Add `after` text node (after the match)
          var after = document.createTextNode(node.data.substring(range.endNodeIndex));
          node.parentNode.insertBefore(after, node);
        }
        node.parentNode.removeChild(node);
        reverts.push(function() {
          var pnode = el.parentNode;
          pnode.insertBefore(el.firstChild, el);
          pnode.removeChild(el);
          pnode.normalize();
        });
        return el;
      } else {
        // Replace startNode -> [innerNodes...] -> endNode (in that order)
        var before = document.createTextNode(startNode.data.substring(0, range.startNodeIndex));
        var after = document.createTextNode(endNode.data.substring(range.endNodeIndex));
        var elA = makeReplacementNode(startNode.data.substring(range.startNodeIndex), matchIndex);
        var innerEls = [];
        for (var i = 0, l = range.innerNodes.length; i < l; ++i) {
          var innerNode = range.innerNodes[i];
          var innerEl = makeReplacementNode(innerNode.data, matchIndex);
          innerNode.parentNode.replaceChild(innerEl, innerNode);
          innerEls.push(innerEl);
        }
        var elB = makeReplacementNode(endNode.data.substring(0, range.endNodeIndex), matchIndex);
        startNode.parentNode.insertBefore(before, startNode);
        startNode.parentNode.insertBefore(elA, startNode);
        startNode.parentNode.removeChild(startNode);
        endNode.parentNode.insertBefore(elB, endNode);
        endNode.parentNode.insertBefore(after, endNode);
        endNode.parentNode.removeChild(endNode);
        reverts.push(function() {
          innerEls.unshift(elA);
          innerEls.push(elB);
          for (var i = 0, l = innerEls.length; i < l; ++i) {
            var el = innerEls[i];
            var pnode = el.parentNode;
            pnode.insertBefore(el.firstChild, el);
            pnode.removeChild(el);
            pnode.normalize();
          }
        });
        return elB;
      }
    };

  }

  return findAndReplaceDOMText;

}());
(function (window, undefined) {

var profaneTerms = [
  'debug',
  'DEBUG',
  'warning',
  'WARNING',
  'warn',
  'WARN',
  'info',
  'INFO',
  'information',
  'INFORMATION',
  'error',
  'ERROR',
  'critical',
  'CRITICAL',
  'fatal',
  'FATAL',
  'none',
  'trace',
  'TRACE',
  'off'
];

function revealProfanity(term) {
    var c = term.charAt(0),
        emoji = (c === c.toUpperCase() ? '????' : '????') + '',
        last = term.length - 1;

    var lower_term = term.toLowerCase();
    if (lower_term == 'off')
      emoji = '????';
    if ( lower_term ==  'trace' || lower_term == 'TRACE')
      emoji = '???????';    
    if ( lower_term ==  'debug' || lower_term == 'DEBUG')
      emoji = '????';
    if (lower_term == 'info' || lower_term =='INFO' || lower_term =='information' || lower_term =='INFORMATION')
      emoji = '??????'; // '????';
    if (lower_term =='warning' || lower_term =='WARNING' || lower_term =='warn' || lower_term =='WARN')
      emoji = '??????';
    if (lower_term =='error' || lower_term =='ERROR')
      emoji = '????';
    if (lower_term =='critical' || lower_term =='CRITICAL')
      emoji = '????';
    if (lower_term =='fatal' || lower_term =='FATAL')
        emoji = '????';
        
    var abbr = document.createElement("abbr");
    abbr.style.textDecoration = 'none';
    abbr.title = term;
    abbr.innerHTML = emoji; //+ "(" + term+ ")";

    return abbr;
}

var profaneRe = new RegExp('(' + profaneTerms.join('|') + ')(?!\\w|[^<]*>)', 'gi');

findAndReplaceDOMText(profaneRe, document.body, revealProfanity);

}(this));
