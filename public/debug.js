// Debug script to check what element is at various points
window.addEventListener('load', function() {
  setTimeout(function() {
    // Scroll to testimonials
    var sec = document.getElementById('testimonials');
    if (!sec) { console.log('DEBUG: #testimonials not found'); return; }
    
    sec.scrollIntoView({ behavior: 'instant' });
    
    setTimeout(function() {
      var results = [];
      
      // Check next button
      var nextBtn = document.querySelector('[aria-label="Next testimonial"]');
      if (nextBtn) {
        var rect = nextBtn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var atPoint = document.elementFromPoint(cx, cy);
        results.push('=== NEXT BUTTON ===');
        results.push('Button rect: left=' + rect.left + ' top=' + rect.top + ' w=' + rect.width + ' h=' + rect.height);
        results.push('Element at point(' + cx + ',' + cy + '): <' + (atPoint ? atPoint.tagName : 'null') + '>');
        results.push('  class: ' + (atPoint ? atPoint.className : ''));
        results.push('  id: ' + (atPoint ? atPoint.id : ''));
        results.push('  is button itself: ' + (atPoint === nextBtn));
        results.push('  button contains hit element: ' + (nextBtn.contains(atPoint)));
        
        // Walk parent chain of blocking element
        var el = atPoint;
        for (var i = 0; i < 10 && el; i++) {
          var s = window.getComputedStyle(el);
          results.push('  chain[' + i + ']: <' + el.tagName + '> z=' + s.zIndex + ' pos=' + s.position + ' pe=' + s.pointerEvents + ' class="' + (el.className || '').toString().substring(0, 80) + '"');
          el = el.parentElement;
        }
      }
      
      // Check prev button
      var prevBtn = document.querySelector('[aria-label="Previous testimonial"]');
      if (prevBtn) {
        var rect2 = prevBtn.getBoundingClientRect();
        var cx2 = rect2.left + rect2.width / 2;
        var cy2 = rect2.top + rect2.height / 2;
        var atPoint2 = document.elementFromPoint(cx2, cy2);
        results.push('=== PREV BUTTON ===');
        results.push('Element at point: <' + (atPoint2 ? atPoint2.tagName : 'null') + '> class="' + (atPoint2 ? atPoint2.className : '').toString().substring(0, 80) + '"');
        results.push('Is button itself: ' + (atPoint2 === prevBtn));
      }
      
      // Check pills
      var pills = document.querySelectorAll('.bk-pill');
      results.push('=== BOOKING PILLS (' + pills.length + ') ===');
      for (var p = 0; p < pills.length; p++) {
        var pr = pills[p].getBoundingClientRect();
        var pcx = pr.left + pr.width / 2;
        var pcy = pr.top + pr.height / 2;
        var pat = document.elementFromPoint(pcx, pcy);
        var isSelf = pat === pills[p] || pills[p].contains(pat);
        results.push('Pill ' + p + ' "' + pills[p].textContent.trim() + '": hit=' + isSelf + ' atPoint=<' + (pat ? pat.tagName : '') + '> class="' + ((pat ? pat.className : '') || '').toString().substring(0, 60) + '"');
      }
      
      // Check for lenis wrapper
      var lenis = document.querySelector('.lenis');
      var html = document.documentElement;
      results.push('=== GLOBAL ===');
      results.push('Lenis class on element: ' + (lenis ? lenis.tagName + ' class=' + lenis.className.substring(0, 100) : 'none'));
      results.push('html classes: ' + html.className.substring(0, 100));
      
      // Output everything  
      var output = results.join('\n');
      console.log(output);
      
      // Also write to a visible element
      var debugDiv = document.createElement('div');
      debugDiv.id = 'debug-output';
      debugDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.95);color:lime;font-family:monospace;font-size:11px;padding:10px;z-index:99999;max-height:60vh;overflow:auto;white-space:pre;pointer-events:auto;';
      debugDiv.textContent = output;
      document.body.appendChild(debugDiv);
    }, 2000);
  }, 3000);
});
