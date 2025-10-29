</script>  

<script>
(function() {
    var devName = "Csm Mohasin Alam";
    var devLink = "https://csm-mohasin.github.io";
    var footerEl = document.getElementById('footerCredit');
    
    function checkCredit() {
        if (!footerEl) return;
        var footerHTML = footerEl.innerHTML;
        
        // Check 1: If the developer's name is not present
        if (footerHTML.indexOf(devName) === -1) {
            window.location.replace(devLink);
            return;
        }
        
        // Check 2: If the correct link is not present or link text is altered
        var anchor = footerEl.querySelector('a[href="' + devLink + '"]');
        if (!anchor || anchor.innerText.indexOf(devName) === -1) {
            window.location.replace(devLink);
            return;
        }
    }
    
    // Run check immediately and periodically (every 5 seconds)
    checkCredit();
    setInterval(checkCredit, 5000); 
})();
</script>
